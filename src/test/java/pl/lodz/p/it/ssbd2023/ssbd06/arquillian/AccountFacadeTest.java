package pl.lodz.p.it.ssbd2023.ssbd06.arquillian;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.inject.Inject;
import lombok.SneakyThrows;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.facades.AccountFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.mok.facades.RoleFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Account;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.AccountDetails;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.AuthInfo;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Role;

class AccountFacadeTest extends BaseArquillianTest {

    @Inject
    private AccountFacade accountFacade;

    @Inject
    private RoleFacade roleFacade;

    @SneakyThrows
    @Test
    void createAccountTest() {
        //given
        userTransaction.begin();
        Account accountEntity = prepareAccount();

        //when
        Account account = accountFacade.create(accountEntity);
        List<Account> accounts = accountFacade.findAll();

        //then
        userTransaction.commit();
        assertEquals(accounts.size(), 1);
        assertEquals(account.getAccountDetails().getFirstName(), "Szymon");
        assertEquals(account.getRoles().size(), 1);
    }

    private static Account prepareAccount() {
        var accountDetails = new AccountDetails("szymon@jpa.pl", "Szymon",
                "Ziemecki", "606509690");
        var authInfo = new AuthInfo();
        var hashedPassword = "$2a$04$j/yqCtlHxKmdxHMWxaji4OD1w591LIMNDGBqUbCpD6HTM4aj2uLiS";
        var accountEntity = new Account("szymozie", hashedPassword,
                accountDetails, authInfo);
        authInfo.setAccount(accountEntity);
        accountEntity.setAuthInfo(authInfo);
        Set<Role> roles = Set.of(Role.valueOf("ADMINISTRATOR"));
        roles.forEach(role -> {
            role.setActive(false);
            role.setAccount(accountEntity);
        });
        accountEntity.setRoles(roles);
        accountEntity.setLocale(Locale.forLanguageTag("pl-PL"));
        return accountEntity;
    }

}