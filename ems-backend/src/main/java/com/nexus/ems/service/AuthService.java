package com.nexus.ems.service;

import com.nexus.ems.dto.request.AuthRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Employee;
import com.nexus.ems.entity.RefreshToken;
import com.nexus.ems.entity.Role;
import com.nexus.ems.entity.User;
import com.nexus.ems.exception.BadRequestException;
import com.nexus.ems.repository.EmployeeRepository;
import com.nexus.ems.repository.UserRepository;
import com.nexus.ems.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public Response.AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
                .build();

        user = userRepository.save(user);

        // Auto-create Employee/Manager profile record
        Employee employee = Employee.builder()
                .user(user)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
        employeeRepository.save(employee);

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return buildAuthResponse(accessToken, refreshToken.getToken(), user);
    }

    public Response.AuthResponse login(AuthRequest.Login request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return buildAuthResponse(accessToken, refreshToken.getToken(), user);
    }

    public Response.AuthResponse refreshToken(AuthRequest.RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtService.generateAccessToken(user);

        return buildAuthResponse(newAccessToken, refreshToken.getToken(), user);
    }

    @Transactional
    public void logout(AuthRequest.RefreshTokenRequest request) {
        try {
            RefreshToken token = refreshTokenService.findByToken(request.getRefreshToken());
            refreshTokenService.deleteByUser(token.getUser());
        } catch (Exception e) {
            log.warn("Logout attempted with invalid/expired refresh token");
        }
    }

    private Response.AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        return Response.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(Response.UserResponse.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .role(user.getRole())
                        .profileImageUrl(user.getProfileImageUrl())
                        .createdAt(user.getCreatedAt())
                        .build())
                .build();
    }
}
