package com.nexus.ems.dto.response;

import com.nexus.ems.entity.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Response {

    @Data
    @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private UserResponse user;
    }

    @Data
    @Builder
    public static class UserResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private Role role;
        private String profileImageUrl;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class EmployeeResponse {
        private Long id;
        private Long userId;
        private Role role;
        private String firstName;
        private String lastName;
        private String email;
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
        private String profileImageUrl;
        private Long managerId;
        private String managerName;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private TaskPriority priority;
        private TaskStatus status;
        private LocalDate dueDate;
        private Long assignedById;
        private String assignedByName;
        private Long assignedToId;
        private String assignedToName;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class AttendanceResponse {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private LocalDate date;
        private LocalTime checkIn;
        private LocalTime checkOut;
        private Double totalHours;
        private AttendanceStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class SalaryResponse {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private Integer month;
        private Integer year;
        private BigDecimal basicSalary;
        private BigDecimal bonus;
        private BigDecimal deductions;
        private Integer presentDays;
        private Integer absentDays;
        private BigDecimal netSalary;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class AdminDashboardResponse {
        private long totalEmployees;
        private long totalManagers;
        private long totalTasks;
        private long completedTasks;
        private long pendingTasks;
        private long inProgressTasks;
        private BigDecimal monthlyPayroll;
        private long attendanceRate;
    }

    @Data
    @Builder
    public static class ManagerDashboardResponse {
        private long teamSize;
        private long assignedTasks;
        private long completedTasks;
        private long pendingTasks;
        private long inProgressTasks;
        private long performanceScore;
    }

    @Data
    @Builder
    public static class EmployeeDashboardResponse {
        private long totalTasks;
        private long completedTasks;
        private long pendingTasks;
        private long inProgressTasks;
        private long attendanceRate;
        private SalaryResponse latestSalary;
    }

    @Data
    @Builder
    public static class ImageUploadResponse {
        private String profileImageUrl;
        private String message;
    }

    @Data
    @Builder
    public static class MessageResponse {
        private String message;
    }
}
