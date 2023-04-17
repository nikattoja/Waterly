package pl.lodz.p.it.ssbd2023.ssbd06.persistence.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tariff")
@Getter
@NoArgsConstructor
public class Tariff extends AbstractEntity {
    @NotNull
    @Column(name = "cold_water_price")
    private BigDecimal coldWaterPrice;
    @NotNull
    @Column(name = "hot_water_price")
    private BigDecimal hotWaterPrice;
    @NotNull
    @Column(name = "trash_price")
    private BigDecimal trashPrice;
    @NotNull
    @Column(name = "start_date")
    private LocalDate startDate;
    @NotNull
    @Column(name = "end_date")
    private LocalDate endDate;
}