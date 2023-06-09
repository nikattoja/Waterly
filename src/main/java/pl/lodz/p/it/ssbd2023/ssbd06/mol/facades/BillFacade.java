package pl.lodz.p.it.ssbd2023.ssbd06.mol.facades;

import static pl.lodz.p.it.ssbd2023.ssbd06.service.security.Permission.FACILITY_MANAGER;
import static pl.lodz.p.it.ssbd2023.ssbd06.service.security.Permission.OWNER;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.extern.java.Log;
import pl.lodz.p.it.ssbd2023.ssbd06.exceptions.interceptors.FacadeExceptionHandler;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.AbstractFacade;
import pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities.Bill;
import pl.lodz.p.it.ssbd2023.ssbd06.service.observability.Monitored;

@Log
@Monitored
@FacadeExceptionHandler
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class BillFacade extends AbstractFacade<Bill> {

    @PersistenceContext(unitName = "molPU")
    private EntityManager em;

    public BillFacade() {
        super(Bill.class);
    }

    @Override
    @PermitAll
    protected EntityManager getEntityManager() {
        return em;
    }

    @RolesAllowed({FACILITY_MANAGER})
    public Bill create(final Bill bill) {
        return super.create(bill);
    }


    @RolesAllowed({OWNER})
    public Optional<Bill> findByOwnerId(final long ownerId, final LocalDate date) {
        try {
            TypedQuery<Bill> billsByOwnerIdTypedQuery = em.createNamedQuery("Bill.findBillsByOwnerIdYearAndMonth", Bill.class);
            billsByOwnerIdTypedQuery.setFlushMode(FlushModeType.COMMIT);
            billsByOwnerIdTypedQuery.setParameter("accountId", ownerId);
            billsByOwnerIdTypedQuery.setParameter("month", date.getMonthValue());
            billsByOwnerIdTypedQuery.setParameter("year", date.getYear());
            return Optional.of(billsByOwnerIdTypedQuery.getSingleResult());
        }
        catch (final NoResultException e){
            return Optional.empty();
        }
    }


    @RolesAllowed({FACILITY_MANAGER, OWNER})
    public List<Bill> findByApartmentId(final long apartmentId) {
        TypedQuery<Bill> billsByApartmentIdTypedQuery = em.createNamedQuery("Bill.findBillsByApartmentId", Bill.class);
        billsByApartmentIdTypedQuery.setFlushMode(FlushModeType.COMMIT);
        billsByApartmentIdTypedQuery.setParameter("apartmentId", apartmentId);
        return billsByApartmentIdTypedQuery.getResultList();
    }

    @Override
    @RolesAllowed({FACILITY_MANAGER, OWNER})
    public Bill findById(final Long id) {
        return super.findById(id);
    }
}
