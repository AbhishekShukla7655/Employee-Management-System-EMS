package com.nexus.ems.controller;

import com.nexus.ems.dto.request.SalaryRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
@Tag(name = "Salary", description = "Salary generation, history, and reports")
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    @Operation(summary = "Get all salary records (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Response.SalaryResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(salaryService.getAll(search, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get salary record by ID")
    public ResponseEntity<Response.SalaryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.getById(id));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current employee's salary history")
    public ResponseEntity<Page<Response.SalaryResponse>> getMySalary(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(salaryService.getMySalary(userDetails.getUsername(), page, size));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get latest salary summary for current user")
    public ResponseEntity<Response.SalaryResponse> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(salaryService.getSummary(userDetails.getUsername()));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate salary for an employee (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.SalaryResponse> generate(@Valid @RequestBody SalaryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salaryService.generate(request));
    }
}
