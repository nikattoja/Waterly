package pl.lodz.p.it.ssbd2023.ssbd06.mol.facades;

import java.util.logging.Logger;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.AbstractFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Tariff;
import pl.lodz.p.it.ssbd2023.ssbd06.service.observability.Monitored;

@Monitored
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class TariffFacade extends AbstractFacade<Tariff> {

    private final Logger log = Logger.getLogger(getClass().getName());

    @PersistenceContext(unitName = "molPU")
    private EntityManager em;

    public TariffFacade() {
        super(Tariff.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
}