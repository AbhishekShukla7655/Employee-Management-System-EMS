package com.nexus.ems.controller;

import com.nexus.ems.dto.request.EmployeeRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.service.EmployeeService;
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

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Employee CRUD, profile, image upload")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all employees (paginated, searchable)")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Page<Response.EmployeeResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(employeeService.getAll(search, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<Response.EmployeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getById(id));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user's employee profile")
    public ResponseEntity<Response.EmployeeResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employeeService.getProfile(userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Create a new employee (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.EmployeeResponse> update(@PathVariable Long id,
                                                             @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.update(id, request));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update own profile")
    public ResponseEntity<Response.EmployeeResponse> updateProfile(
            @RequestBody EmployeeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employeeService.updateProfile(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response.MessageResponse> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok(Response.MessageResponse.builder().message("Employee deleted successfully").build());
    }

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload profile image to Cloudinary")
    public ResponseEntity<Response.ImageUploadResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        return ResponseEntity.ok(employeeService.uploadImage(id, file));
    }
}
