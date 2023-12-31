package pl.lodz.p.it.ssbd2023.ssbd06.service.security;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.security.enterprise.SecurityContext;

@Stateless
public class AuthenticatedAccount {

    @Inject
    private SecurityContext securityContext;

    public String getLogin() {
        return securityContext.getCallerPrincipal() == null ? "GUEST" : securityContext.getCallerPrincipal().getName();
    }
}
