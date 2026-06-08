package com.nexus.ems.repository;

import com.nexus.ems.entity.Employee;
import com.nexus.ems.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUser(User user);

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByUserId(Long userId);

    boolean existsByEmail(String email);

    List<Employee> findByManager(Employee manager);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(COALESCE(e.department,'')) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Employee> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.manager = :manager AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Employee> findByManagerWithSearch(@Param("manager") Employee manager,
                                           @Param("search") String search,
                                           Pageable pageable);

    long count();
}
