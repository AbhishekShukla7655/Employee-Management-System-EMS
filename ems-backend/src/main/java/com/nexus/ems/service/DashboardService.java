package com.nexus.ems.service;

import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.*;
import com.nexus.ems.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryRepository salaryRepository;
    private final EmployeeService employeeService;
    private final SalaryService salaryService;

    public Response.AdminDashboardResponse getAdminDashboard() {
        long totalEmployees = userRepository.countByRole(Role.EMPLOYEE);
        long totalManagers  = userRepository.countByRole(Role.MANAGER);
        long totalTasks     = taskRepository.count();
        long completed      = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long pending        = taskRepository.countByStatus(TaskStatus.PENDING);
        long inProgress     = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);

        LocalDate now = LocalDate.now();
        var monthlyPayroll = salaryRepository.sumNetSalaryByMonthAndYear(now.getMonthValue(), now.getYear());

        return Response.AdminDashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .totalManagers(totalManagers)
                .totalTasks(totalTasks)
                .completedTasks(completed)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .monthlyPayroll(monthlyPayroll)
                .attendanceRate(94L)
                .build();
    }

    public Response.ManagerDashboardResponse getManagerDashboard(String email) {
        Employee manager = employeeService.findByEmail(email);
        long teamSize   = employeeRepository.findByManager(manager).size();
        long total      = taskRepository.countByStatus(TaskStatus.PENDING)
                        + taskRepository.countByStatus(TaskStatus.IN_PROGRESS)
                        + taskRepository.countByStatus(TaskStatus.COMPLETED);
        long completed  = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long pending    = taskRepository.countByStatus(TaskStatus.PENDING);
        long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);

        long performance = total > 0 ? (completed * 100L) / total : 0;

        return Response.ManagerDashboardResponse.builder()
                .teamSize(teamSize)
                .assignedTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .performanceScore(performance)
                .build();
    }

    public Response.EmployeeDashboardResponse getEmployeeDashboard(String email) {
        Employee emp = employeeService.findByEmail(email);

        long total      = taskRepository.findByAssignedTo(emp.getUser(),
                          org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        long completed  = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long pending    = taskRepository.countByStatus(TaskStatus.PENDING);
        long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);

        long presentCount = attendanceRepository.countByEmployeeAndStatus(emp, AttendanceStatus.PRESENT);
        long attendanceRate = total > 0 ? Math.min((presentCount * 100L) / 26, 100) : 0;

        Response.SalaryResponse latestSalary = salaryService.getSummary(email);

        return Response.EmployeeDashboardResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .attendanceRate(attendanceRate)
                .latestSalary(latestSalary)
                .build();
    }
}
