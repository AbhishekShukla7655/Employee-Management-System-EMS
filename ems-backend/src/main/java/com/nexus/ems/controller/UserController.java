package com.nexus.ems.controller;

import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Role;
import com.nexus.ems.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Users", description = "User management and role assignment (Admin only)")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<Page<Response.UserResponse>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAll(search, page, size));
    }

    @PatchMapping("/{id}/role")
    @Operation(summary = "Change user role")
    public ResponseEntity<Response.UserResponse> changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role"));
        return ResponseEntity.ok(userService.changeRole(id, role));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<Response.MessageResponse> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(Response.MessageResponse.builder().message("User deleted successfully").build());
    }
}
