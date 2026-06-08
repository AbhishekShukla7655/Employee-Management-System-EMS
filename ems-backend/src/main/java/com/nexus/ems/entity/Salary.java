package com.nexus.ems.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salaries", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "month", "year"})
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 12, scale = 2)
    private BigDecimal bonus;

    @Column(precision = 12, scale = 2)
    private BigDecimal deductions;

    private Integer presentDays;
    private Integer absentDays;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
