package com.nexus.ems.dto.request;

import com.nexus.ems.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceRequest {

    private Long employeeId;

    @NotNull
    private LocalDate date;

    private LocalTime checkIn;
    private LocalTime checkOut;

    @NotNull
    private AttendanceStatus status;
}
