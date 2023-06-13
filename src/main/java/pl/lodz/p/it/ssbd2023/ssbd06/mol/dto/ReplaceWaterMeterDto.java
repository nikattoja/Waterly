package pl.lodz.p.it.ssbd2023.ssbd06.mol.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.lodz.p.it.ssbd2023.ssbd06.service.validators.ExpiryDate;
import pl.lodz.p.it.ssbd2023.ssbd06.service.validators.StartingValue;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplaceWaterMeterDto {

    @StartingValue
    private BigDecimal startingValue;
    @ExpiryDate
    private String expiryDate;

}
