package com.nexus.ems.dto.request;

import com.nexus.ems.entity.TaskPriority;
import com.nexus.ems.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private TaskPriority priority;

    private TaskStatus status = TaskStatus.PENDING;

    private LocalDate dueDate;

    private Long assignedToId;
}
