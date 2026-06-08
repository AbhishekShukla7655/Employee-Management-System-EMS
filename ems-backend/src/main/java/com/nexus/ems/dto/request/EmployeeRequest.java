package com.nexus.ems.dto.request;

import com.nexus.ems.entity.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    private String password;

    private String phoneNumber;
    private String address;
    private Integer age;
    private Gender gender;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private String education;
    private Integer experience;
    private String designation;
    private String department;
    private BigDecimal salary;
    private Long managerId;
}
