package com.nexus.ems.service;

import com.nexus.ems.dto.request.AttendanceRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Attendance;
import com.nexus.ems.entity.AttendanceStatus;
import com.nexus.ems.entity.Employee;
import com.nexus.ems.exception.BadRequestException;
import com.nexus.ems.exception.ResourceNotFoundException;
import com.nexus.ems.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeService employeeService;

    public Page<Response.AttendanceResponse> getAll(String search, LocalDate date, AttendanceStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return attendanceRepository.findAllWithFilters(search, date, status, pageable).map(this::toResponse);
    }

    public Page<Response.AttendanceResponse> getMyAttendance(String email, Integer month, Integer year, int page, int size) {
        Employee emp = employeeService.findByEmail(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return attendanceRepository.findByEmployeeAndMonth(emp, month, year, pageable).map(this::toResponse);
    }

    public Page<Response.AttendanceResponse> getTeamAttendance(String managerEmail, LocalDate date, int page, int size) {
        Employee manager = employeeService.findByEmail(managerEmail);
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return attendanceRepository.findByManagerWithDateFilter(manager, date, pageable).map(this::toResponse);
    }

    @Transactional
    public Response.AttendanceResponse create(AttendanceRequest req) {
        Employee emp = (req.getEmployeeId() != null)
                ? employeeService.findById(req.getEmployeeId())
                : null;

        if (emp == null) throw new BadRequestException("Employee ID is required");

        if (attendanceRepository.findByEmployeeAndDate(emp, req.getDate()).isPresent()) {
            throw new BadRequestException("Attendance already recorded for this employee on " + req.getDate());
        }

        double totalHours = 0;
        if (req.getCheckIn() != null && req.getCheckOut() != null) {
            totalHours = ChronoUnit.MINUTES.between(req.getCheckIn(), req.getCheckOut()) / 60.0;
        }

        Attendance attendance = Attendance.builder()
                .employee(emp)
                .date(req.getDate())
                .checkIn(req.getCheckIn())
                .checkOut(req.getCheckOut())
                .totalHours(totalHours > 0 ? totalHours : null)
                .status(req.getStatus())
                .build();

        return toResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public Response.AttendanceResponse update(Long id, AttendanceRequest req) {
        Attendance att = findById(id);

        att.setCheckIn(req.getCheckIn());
        att.setCheckOut(req.getCheckOut());
        att.setStatus(req.getStatus());

        if (req.getCheckIn() != null && req.getCheckOut() != null) {
            double hours = ChronoUnit.MINUTES.between(req.getCheckIn(), req.getCheckOut()) / 60.0;
            att.setTotalHours(hours);
        }

        return toResponse(attendanceRepository.save(att));
    }

    @Transactional
    public Response.AttendanceResponse checkIn(String email) {
        Employee emp = employeeService.findByEmail(email);
        LocalDate today = LocalDate.now();

        Attendance att = attendanceRepository.findByEmployeeAndDate(emp, today)
                .orElse(Attendance.builder().employee(emp).date(today).status(AttendanceStatus.PRESENT).build());

        att.setCheckIn(LocalTime.now());
        att.setStatus(AttendanceStatus.PRESENT);
        return toResponse(attendanceRepository.save(att));
    }

    @Transactional
    public Response.AttendanceResponse checkOut(String email) {
        Employee emp = employeeService.findByEmail(email);
        LocalDate today = LocalDate.now();

        Attendance att = attendanceRepository.findByEmployeeAndDate(emp, today)
                .orElseThrow(() -> new BadRequestException("No check-in found for today"));

        att.setCheckOut(LocalTime.now());
        if (att.getCheckIn() != null) {
            double hours = ChronoUnit.MINUTES.between(att.getCheckIn(), att.getCheckOut()) / 60.0;
            att.setTotalHours(Math.round(hours * 100.0) / 100.0);
        }
        return toResponse(attendanceRepository.save(att));
    }

    private Attendance findById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found: " + id));
    }

    Response.AttendanceResponse toResponse(Attendance a) {
        String empName = a.getEmployee() != null
                ? a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName() : null;
        return Response.AttendanceResponse.builder()
                .id(a.getId())
                .employeeId(a.getEmployee() != null ? a.getEmployee().getId() : null)
                .employeeName(empName)
                .date(a.getDate())
                .checkIn(a.getCheckIn())
                .checkOut(a.getCheckOut())
                .totalHours(a.getTotalHours())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
