package com.nexus.ems.repository;

import com.nexus.ems.entity.Attendance;
import com.nexus.ems.entity.AttendanceStatus;
import com.nexus.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);

    Page<Attendance> findByEmployee(Employee employee, Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE a.employee = :employee AND " +
           "(:month IS NULL OR MONTH(a.date) = :month) AND " +
           "(:year IS NULL OR YEAR(a.date) = :year)")
    Page<Attendance> findByEmployeeAndMonth(@Param("employee") Employee employee,
                                            @Param("month") Integer month,
                                            @Param("year") Integer year,
                                            Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE a.employee.manager = :manager AND " +
           "(:date IS NULL OR a.date = :date)")
    Page<Attendance> findByManagerWithDateFilter(@Param("manager") Employee manager,
                                                 @Param("date") LocalDate date,
                                                 Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.employee.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(a.employee.lastName) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:date IS NULL OR a.date = :date) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Attendance> findAllWithFilters(@Param("search") String search,
                                        @Param("date") LocalDate date,
                                        @Param("status") AttendanceStatus status,
                                        Pageable pageable);

    long countByEmployeeAndStatus(Employee employee, AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee = :employee AND " +
           "MONTH(a.date) = :month AND YEAR(a.date) = :year")
    long countByEmployeeAndMonthAndYear(@Param("employee") Employee employee,
                                        @Param("month") int month,
                                        @Param("year") int year);
}
