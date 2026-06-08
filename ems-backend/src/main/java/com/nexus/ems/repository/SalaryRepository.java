package com.nexus.ems.repository;

import com.nexus.ems.entity.Employee;
import com.nexus.ems.entity.Salary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Optional<Salary> findByEmployeeAndMonthAndYear(Employee employee, int month, int year);

    Page<Salary> findByEmployee(Employee employee, Pageable pageable);

    Page<Salary> findByEmployeeOrderByYearDescMonthDesc(Employee employee, Pageable pageable);

    @Query("SELECT s FROM Salary s WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(s.employee.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(s.employee.lastName) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Salary> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT SUM(s.netSalary) FROM Salary s WHERE s.month = :month AND s.year = :year")
    BigDecimal sumNetSalaryByMonthAndYear(@Param("month") int month, @Param("year") int year);

    List<Salary> findByEmployee(Employee employee);
}
