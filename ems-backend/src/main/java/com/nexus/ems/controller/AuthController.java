package com.nexus.ems.controller;

import com.nexus.ems.dto.request.AuthRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, Register, Logout, Token Refresh")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<Response.AuthResponse> register(@Valid @RequestBody AuthRequest.Register request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT tokens")
    public ResponseEntity<Response.AuthResponse> login(@Valid @RequestBody AuthRequest.Login request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<Response.AuthResponse> refreshToken(@Valid @RequestBody AuthRequest.RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and invalidate refresh token")
    public ResponseEntity<Response.MessageResponse> logout(@RequestBody AuthRequest.RefreshTokenRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(Response.MessageResponse.builder().message("Logged out successfully").build());
    }
}
