package com.nexus.ems.repository;

import com.nexus.ems.entity.Task;
import com.nexus.ems.entity.TaskStatus;
import com.nexus.ems.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByAssignedTo(User user, Pageable pageable);

    Page<Task> findByAssignedBy(User user, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND " +
           "(:search IS NULL OR :search = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:status IS NULL OR t.status = :status)")
    Page<Task> findByAssignedToWithFilters(@Param("user") User user,
                                           @Param("search") String search,
                                           @Param("status") TaskStatus status,
                                           Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "(t.assignedBy = :user OR t.assignedTo = :user) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Task> findTeamTasksByUser(@Param("user") User user,
                                   @Param("search") String search,
                                   Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Task> findAllWithSearch(@Param("search") String search, Pageable pageable);

    long countByStatus(TaskStatus status);
}
