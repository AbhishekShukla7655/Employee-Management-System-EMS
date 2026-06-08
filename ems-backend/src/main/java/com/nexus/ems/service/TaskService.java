package com.nexus.ems.service;

import com.nexus.ems.dto.request.TaskRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Task;
import com.nexus.ems.entity.TaskStatus;
import com.nexus.ems.entity.User;
import com.nexus.ems.exception.BadRequestException;
import com.nexus.ems.exception.ResourceNotFoundException;
import com.nexus.ems.repository.TaskRepository;
import com.nexus.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Page<Response.TaskResponse> getAll(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findAllWithSearch(search, pageable).map(this::toResponse);
    }

    public Response.TaskResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public Page<Response.TaskResponse> getMyTasks(String email, String search, TaskStatus status, int page, int size) {
        User user = findUserByEmail(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findByAssignedToWithFilters(user, search, status, pageable).map(this::toResponse);
    }

    public Page<Response.TaskResponse> getTeamTasks(String email, String search, int page, int size) {
        User user = findUserByEmail(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findTeamTasksByUser(user, search, pageable).map(this::toResponse);
    }

    @Transactional
    public Response.TaskResponse create(TaskRequest req, String assignedByEmail) {
        User assignedBy = findUserByEmail(assignedByEmail);
        User assignedTo = null;
        if (req.getAssignedToId() != null) {
            assignedTo = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getAssignedToId()));
        }

        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority())
                .status(req.getStatus() != null ? req.getStatus() : TaskStatus.PENDING)
                .dueDate(req.getDueDate())
                .assignedBy(assignedBy)
                .assignedTo(assignedTo)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public Response.TaskResponse update(Long id, TaskRequest req, String currentUserEmail) {
        Task task = findById(id);

        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority());
        if (req.getStatus() != null) task.setStatus(req.getStatus());
        task.setDueDate(req.getDueDate());

        if (req.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public Response.TaskResponse updateStatus(Long id, TaskStatus status, String email) {
        Task task = findById(id);
        // Employees can only update tasks assigned to them
        User user = findUserByEmail(email);
        if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(user.getId())) {
            // Admins/managers can update any task
            if (user.getRole().name().equals("EMPLOYEE")) {
                throw new BadRequestException("You can only update your own tasks");
            }
        }
        task.setStatus(status);
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void delete(Long id) {
        taskRepository.delete(findById(id));
    }

    // ── Helpers ────────────────────────────────────────────────

    private Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Response.TaskResponse toResponse(Task t) {
        return Response.TaskResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .priority(t.getPriority())
                .status(t.getStatus())
                .dueDate(t.getDueDate())
                .assignedById(t.getAssignedBy() != null ? t.getAssignedBy().getId() : null)
                .assignedByName(t.getAssignedBy() != null
                        ? t.getAssignedBy().getFirstName() + " " + t.getAssignedBy().getLastName() : null)
                .assignedToId(t.getAssignedTo() != null ? t.getAssignedTo().getId() : null)
                .assignedToName(t.getAssignedTo() != null
                        ? t.getAssignedTo().getFirstName() + " " + t.getAssignedTo().getLastName() : null)
                .createdAt(t.getCreatedAt())
                .build();
    }
}
