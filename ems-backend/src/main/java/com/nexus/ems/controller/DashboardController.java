package com.nexus.ems.controller;

import com.nexus.ems.dto.response.Response;
import com.nexus.ems.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Role-based dashboard statistics")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @Operation(summary = "Admin dashboard stats")
    public ResponseEntity<Response.AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/manager")
    @Operation(summary = "Manager dashboard stats")
    public ResponseEntity<Response.ManagerDashboardResponse> getManagerDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getManagerDashboard(userDetails.getUsername()));
    }

    @GetMapping("/employee")
    @Operation(summary = "Employee dashboard stats")
    public ResponseEntity<Response.EmployeeDashboardResponse> getEmployeeDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getEmployeeDashboard(userDetails.getUsername()));
    }
}
