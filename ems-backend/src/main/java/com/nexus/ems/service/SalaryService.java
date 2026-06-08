package com.nexus.ems.service;

import com.nexus.ems.dto.request.SalaryRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Employee;
import com.nexus.ems.entity.Salary;
import com.nexus.ems.exception.BadRequestException;
import com.nexus.ems.exception.ResourceNotFoundException;
import com.nexus.ems.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private static final int WORKING_DAYS = 26;

    private final SalaryRepository salaryRepository;
    private final EmployeeService employeeService;

    public Page<Response.SalaryResponse> getAll(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return salaryRepository.findAllWithSearch(search, pageable).map(this::toResponse);
    }

    public Response.SalaryResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public Page<Response.SalaryResponse> getMySalary(String email, int page, int size) {
        Employee emp = employeeService.findByEmail(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by("year").descending().and(Sort.by("month").descending()));
        return salaryRepository.findByEmployeeOrderByYearDescMonthDesc(emp, pageable).map(this::toResponse);
    }

    @Transactional
    public Response.SalaryResponse generate(SalaryRequest req) {
        Employee emp = employeeService.findById(req.getEmployeeId());

        if (salaryRepository.findByEmployeeAndMonthAndYear(emp, req.getMonth(), req.getYear()).isPresent()) {
            throw new BadRequestException("Salary already generated for this employee for "
                    + req.getMonth() + "/" + req.getYear());
        }

        // Net Salary = (basicSalary / workingDays × presentDays) + bonus - deductions
        int presentDays = req.getPresentDays() != null ? req.getPresentDays() : WORKING_DAYS;
        int absentDays  = req.getAbsentDays()  != null ? req.getAbsentDays()  : 0;
        BigDecimal bonus      = req.getBonus()      != null ? req.getBonus()      : BigDecimal.ZERO;
        BigDecimal deductions = req.getDeductions() != null ? req.getDeductions() : BigDecimal.ZERO;

        BigDecimal dailyRate  = req.getBasicSalary()
                .divide(BigDecimal.valueOf(WORKING_DAYS), 4, RoundingMode.HALF_UP);
        BigDecimal earnedBase = dailyRate.multiply(BigDecimal.valueOf(presentDays));
        BigDecimal netSalary  = earnedBase.add(bonus).subtract(deductions)
                .setScale(2, RoundingMode.HALF_UP);

        Salary salary = Salary.builder()
                .employee(emp)
                .month(req.getMonth())
                .year(req.getYear())
                .basicSalary(req.getBasicSalary())
                .bonus(bonus)
                .deductions(deductions)
                .presentDays(presentDays)
                .absentDays(absentDays)
                .netSalary(netSalary)
                .build();

        return toResponse(salaryRepository.save(salary));
    }

    public Response.SalaryResponse getSummary(String email) {
        Employee emp = employeeService.findByEmail(email);
        return salaryRepository.findByEmployee(emp)
                .stream()
                .findFirst()
                .map(this::toResponse)
                .orElse(null);
    }

    private Salary findById(Long id) {
        return salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found: " + id));
    }

    Response.SalaryResponse toResponse(Salary s) {
        String name = s.getEmployee() != null
                ? s.getEmployee().getFirstName() + " " + s.getEmployee().getLastName() : null;
        return Response.SalaryResponse.builder()
                .id(s.getId())
                .employeeId(s.getEmployee() != null ? s.getEmployee().getId() : null)
                .employeeName(name)
                .month(s.getMonth())
                .year(s.getYear())
                .basicSalary(s.getBasicSalary())
                .bonus(s.getBonus())
                .deductions(s.getDeductions())
                .presentDays(s.getPresentDays())
                .absentDays(s.getAbsentDays())
                .netSalary(s.getNetSalary())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
