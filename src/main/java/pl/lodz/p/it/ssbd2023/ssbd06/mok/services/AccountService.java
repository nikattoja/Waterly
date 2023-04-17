package pl.lodz.p.it.ssbd2023.ssbd06.mok.services;

import static pl.lodz.p.it.ssbd2023.ssbd06.service.security.Permission.ADMINISTRATOR;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Logger;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.inject.Inject;
import jakarta.security.enterprise.identitystore.PasswordHash;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.dto.AccountDto;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.dto.EditAccountRolesDto;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.exceptions.AccountAlreadyExist;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.exceptions.ApplicationBaseException;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.exceptions.CannotModifyPermissionsException;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.exceptions.ForbiddenOperationException;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.exceptions.OperationUnsupportedException;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.facades.AccountFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.facades.RoleFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Account;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.AccountDetails;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.AuthInfo;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Role;
import pl.lodz.p.it.ssbd2023.ssbd06.service.config.Property;
import pl.lodz.p.it.ssbd2023.ssbd06.service.notifications.NotificationsProvider;
import pl.lodz.p.it.ssbd2023.ssbd06.service.security.AuthenticatedAccount;
import pl.lodz.p.it.ssbd2023.ssbd06.service.security.password.BCryptHash;

@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class AccountService {

    private final Logger log = Logger.getLogger(AccountService.class.getName());

    @Inject
    private AccountFacade accountFacade;
    @Inject
    private RoleFacade roleFacade;
    @Inject
    private NotificationsProvider notificationsProvider;
    @Inject
    private AccountActivationTimer accountActivationTimer;
    @Inject
    private AuthenticatedAccount authenticatedAccount;
    @Inject
    @BCryptHash
    private PasswordHash hashProvider;

    @Inject
    @Property("auth.attempts")
    private int authAttempts;

    @PermitAll
    public boolean checkAccountActive(final String login) {
        return accountFacade.findByLogin(login).isActive();
    }

    @PermitAll
    public void changeAccountActiveStatus(final long id, final boolean active) {
        Account account = accountFacade.findById(id);
        account.setActive(active);
        account.getAuthInfo().setIncorrectAuthCount(0);
        accountFacade.update(account);
        notificationsProvider.notifyAccountActiveStatusChanged(id);
    }

    @PermitAll
    public void updateSuccessfulAuthInfo(final LocalDateTime authenticationDate, final String login, final String ipAddress) {
        var account = accountFacade.findByLogin(login);
        var accountAuthInfo = account.getAuthInfo();

        accountAuthInfo.setIncorrectAuthCount(0);
        accountAuthInfo.setLastSuccessAuth(authenticationDate);
        accountAuthInfo.setLastIpAddress(ipAddress);

        accountFacade.update(account);
    }

    @PermitAll
    public void updateFailedAuthInfo(final LocalDateTime authenticationDate, final String login) {
        var account = accountFacade.findByLogin(login);
        var accountAuthInfo = account.getAuthInfo();
        var authAttemptsCount = accountAuthInfo.getIncorrectAuthCount();

        accountAuthInfo.setIncorrectAuthCount(authAttemptsCount + 1);
        accountAuthInfo.setLastIncorrectAuth(authenticationDate);

        if (++authAttemptsCount == authAttempts) {
            this.changeAccountActiveStatus(account.getId(), false);
            accountActivationTimer.scheduleAccountActivation(account.getId());
        }

        accountFacade.update(account);
    }

    @RolesAllowed(ADMINISTRATOR)
    public void updateAccountDetails(final long id, final AccountDetails accountDetails) {
        Account account = accountFacade.findById(id);
        addAccountDetailsToUpdate(account, accountDetails);
    }

    @PermitAll
    public Account findByLogin(final String login) {
        return accountFacade.findByLogin(login);
    }

    @PermitAll
    public void changePassword(final Account account, final String hashedPassword) {
        account.setPassword(hashedPassword);
        accountFacade.update(account);
    }

    @PermitAll
    public void updateOwnAccountDetails(final String login, final AccountDetails accountDetails) {
        Account account = accountFacade.findByLogin(login);
        addAccountDetailsToUpdate(account, accountDetails);
    }

    @PermitAll
    public void resendEmailToAcceptAccountDetailsUpdate(final String login) {
        Account account = accountFacade.findByLogin(login);

        notificationsProvider.notifyWaitingAccountDetailsUpdate(account.getId());
    }

    public void acceptAccountDetailsUpdate(final long id) {
        Account account = accountFacade.findByWaitingAccountDetailsId(id);

        account.setAccountDetails(account.getWaitingAccountDetails());
        account.setWaitingAccountDetails(null);

        accountFacade.update(account);
    }

    @PermitAll
    public void editAccountRoles(final long id, final EditAccountRolesDto editAccountRolesDto) throws ApplicationBaseException {
        var account = accountFacade.findById(id);
        if (isModifyingAnotherUser(account)) {
            switch (editAccountRolesDto.getOperation()) {
                case GRANT -> grantPermissions(editAccountRolesDto, account);
                case REVOKE -> revokePermissions(editAccountRolesDto, account);
                default -> throw new OperationUnsupportedException("Unsupported operation");
            }
        } else {
            throw new ForbiddenOperationException("Forbidden operation");
        }
    }

    private void revokePermissions(final EditAccountRolesDto editAccountRolesDto, final Account account) throws ApplicationBaseException {
        for (String roleToRevoke : editAccountRolesDto.getRoles()) {
            performRevokePermissionOperation(account, roleToRevoke);
        }

        accountFacade.update(account);
        notificationsProvider.notifyRoleRevoked(account.getId(), editAccountRolesDto.getRoles());
    }

    private void grantPermissions(final EditAccountRolesDto editAccountRolesDto, final Account account) throws ApplicationBaseException {
        for (String roleToGrant : editAccountRolesDto.getRoles()) {
            performGrantPermissionOperation(account, roleToGrant);
        }

        accountFacade.update(account);
        notificationsProvider.notifyRoleGranted(account.getId(), editAccountRolesDto.getRoles());
    }

    private void performGrantPermissionOperation(final Account account, final String role) throws ApplicationBaseException {
        Set<Role> accountRoles = account.getRoles();
        Optional<Role> foundRole = roleFacade.findRoleByAccountAndPermissionLevel(account, role);
        if (foundRole.isPresent()) {
            log.info("Account has already granted " + role + " role");
            throw new CannotModifyPermissionsException("Account has already granted " + role + " role");
        }
        Role roleToAdd = Role.valueOf(role);
        roleToAdd.setAccount(account);
        roleToAdd.setCreatedBy(account);
        accountRoles.add(roleToAdd);
    }

    private void performRevokePermissionOperation(final Account account, final String role) throws ApplicationBaseException {
        Set<Role> accountRoles = account.getRoles();
        Optional<Role> roleToRemove = roleFacade.findRoleByAccountAndPermissionLevel(account, role);
        if (roleToRemove.isEmpty()) {
            log.info("Account has no granted " + role + " role");
            throw new CannotModifyPermissionsException("Account has no granted " + role + " role");
        }
        accountRoles.remove(roleToRemove.get());
        roleFacade.delete(roleToRemove.get());
    }

    private void addAccountDetailsToUpdate(final Account account, final AccountDetails accountDetails) {
        String currentAccountEmail = account.getAccountDetails().getEmail();

        accountFacade.findByEmail(accountDetails.getEmail()).ifPresent(it -> {
            log.info("Account details update error: account with email" + accountDetails.getEmail() + "already exist" + account.getId());
            throw new AccountAlreadyExist("Account already exist with email: " + accountDetails.getEmail());
        });

        if (currentAccountEmail.equalsIgnoreCase(accountDetails.getEmail())) {
            updateAccountDetails(accountDetails, account);
            log.info("Account details updated: " + account.getId());
        } else {
            account.setWaitingAccountDetails(accountDetails);
            accountFacade.update(account);
            notificationsProvider.notifyWaitingAccountDetailsUpdate(account.getId());
            log.info("Added account details waiting for accept: " + account.getId());
        }
    }

    private void updateAccountDetails(final AccountDetails newAccountDetails, final Account account) {
        AccountDetails currentAccountDetails = account.getAccountDetails();

        currentAccountDetails.setFirstName(newAccountDetails.getFirstName());
        currentAccountDetails.setLastName(newAccountDetails.getLastName());
        currentAccountDetails.setPhoneNumber(newAccountDetails.getPhoneNumber());

        accountFacade.update(account);
    }

    private boolean isModifyingAnotherUser(final Account account) {
        return !account.getLogin().equals(authenticatedAccount.getLogin());
    }

    @PermitAll
    public void registerUser(final AccountDto account) {
        var accountDetails = new AccountDetails(account.getEmail(), account.getFirstName(),
                account.getLastName(), account.getPhoneNumber());
        var authInfo = new AuthInfo();
        var hashedPassword = hashProvider.generate(account.getPassword().toCharArray());
        var accountEntity = new Account(account.getLogin(), hashedPassword,
                accountDetails, authInfo);
        authInfo.setAccount(accountEntity);
        accountEntity.setAuthInfo(authInfo);
        accountFacade.create(accountEntity);
    }

}