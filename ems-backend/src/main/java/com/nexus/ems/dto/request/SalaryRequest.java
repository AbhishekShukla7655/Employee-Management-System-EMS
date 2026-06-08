package com.nexus.ems.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryRequest {

    @NotNull
    private Long employeeId;

    @NotNull @Min(1) @Max(12)
    private Integer month;

    @NotNull
    private Integer year;

    @NotNull
    private BigDecimal basicSalary;

    private BigDecimal bonus = BigDecimal.ZERO;
    private BigDecimal deductions = BigDecimal.ZERO;
    private Integer presentDays = 26;
    private Integer absentDays = 0;
}
