package com.nexus.ems.controller;

import com.nexus.ems.dto.request.EmployeeRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.service.ManagerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
@RequiredArgsConstructor
@Tag(name = "Managers", description = "Manager CRUD, team management, profile")
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping
    @Operation(summary = "Get all managers (paginated)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Response.EmployeeResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(managerService.getAll(search, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get manager by ID")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Response.EmployeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(managerService.getById(id));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current manager profile")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Response.EmployeeResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(managerService.getProfile(userDetails.getUsername()));
    }

    @GetMapping("/team")
    @Operation(summary = "Get team members of current manager")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<Response.EmployeeResponse>> getTeam(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(managerService.getTeam(userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Create a new manager (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(managerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update manager (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.EmployeeResponse> update(@PathVariable Long id,
                                                             @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(managerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete manager (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.MessageResponse> delete(@PathVariable Long id) {
        managerService.delete(id);
        return ResponseEntity.ok(Response.MessageResponse.builder().message("Manager deleted successfully").build());
    }

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload manager profile image")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Response.ImageUploadResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        return ResponseEntity.ok(managerService.uploadImage(id, file));
    }
}
