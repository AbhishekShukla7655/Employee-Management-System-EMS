package com.nexus.ems.service;

import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Role;
import com.nexus.ems.entity.User;
import com.nexus.ems.exception.ResourceNotFoundException;
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
public class UserService {

    private final UserRepository userRepository;

    public Page<Response.UserResponse> getAll(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return userRepository.findAllWithSearch(search, pageable).map(this::toResponse);
    }

    @Transactional
    public Response.UserResponse changeRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setRole(role);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }

    private Response.UserResponse toResponse(User u) {
        return Response.UserResponse.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .role(u.getRole())
                .profileImageUrl(u.getProfileImageUrl())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
