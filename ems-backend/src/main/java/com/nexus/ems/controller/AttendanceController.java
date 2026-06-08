package com.nexus.ems.controller;

import com.nexus.ems.dto.request.AttendanceRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.AttendanceStatus;
import com.nexus.ems.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance tracking, check-in/out, reports")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "Get all attendance records (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Response.AttendanceResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) AttendanceStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attendanceService.getAll(search, date, status, page, size));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's attendance history")
    public ResponseEntity<Page<Response.AttendanceResponse>> getMyAttendance(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                attendanceService.getMyAttendance(userDetails.getUsername(), month, year, page, size));
    }

    @GetMapping("/team")
    @Operation(summary = "Get team attendance (Manager)")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Page<Response.AttendanceResponse>> getTeamAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(attendanceService.getTeamAttendance(userDetails.getUsername(), date, page, size));
    }

    @PostMapping
    @Operation(summary = "Record attendance (Admin/Manager)")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Response.AttendanceResponse> create(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update attendance record")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Response.AttendanceResponse> update(@PathVariable Long id,
                                                               @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.update(id, request));
    }

    @PostMapping("/check-in")
    @Operation(summary = "Employee self check-in")
    public ResponseEntity<Response.AttendanceResponse> checkIn(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(attendanceService.checkIn(userDetails.getUsername()));
    }

    @PostMapping("/check-out")
    @Operation(summary = "Employee self check-out")
    public ResponseEntity<Response.AttendanceResponse> checkOut(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(attendanceService.checkOut(userDetails.getUsername()));
    }
}
