package com.nexus.ems.dto.request;

import com.nexus.ems.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequest {

    @Data
    public static class Login {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
    }

    @Data
    public static class Register {
        @NotBlank
        private String firstName;
        @NotBlank
        private String lastName;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private String phoneNumber;
        @NotNull
        private Role role;
    }

    @Data
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }
}
