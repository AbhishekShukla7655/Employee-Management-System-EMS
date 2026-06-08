package com.nexus.ems.controller;

import com.nexus.ems.dto.request.TaskRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.TaskStatus;
import com.nexus.ems.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task assignment, tracking, and status updates")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks (Admin)")
    public ResponseEntity<Page<Response.TaskResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(taskService.getAll(search, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<Response.TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @GetMapping("/my-tasks")
    @Operation(summary = "Get tasks assigned to current user")
    public ResponseEntity<Page<Response.TaskResponse>> getMyTasks(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false)  TaskStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getMyTasks(userDetails.getUsername(), search, status, page, size));
    }

    @GetMapping("/team")
    @Operation(summary = "Get team tasks (for Managers)")
    public ResponseEntity<Page<Response.TaskResponse>> getTeamTasks(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTeamTasks(userDetails.getUsername(), search, page, size));
    }

    @PostMapping
    @Operation(summary = "Create/assign a task")
    public ResponseEntity<Response.TaskResponse> create(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.create(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<Response.TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.update(id, request, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<Response.TaskResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskStatus status = TaskStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(taskService.updateStatus(id, status, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Response.MessageResponse> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.ok(Response.MessageResponse.builder().message("Task deleted successfully").build());
    }
}
