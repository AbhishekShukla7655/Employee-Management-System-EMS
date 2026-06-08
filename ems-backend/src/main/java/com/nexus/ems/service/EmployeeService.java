package com.nexus.ems.service;

import com.nexus.ems.dto.request.EmployeeRequest;
import com.nexus.ems.dto.response.Response;
import com.nexus.ems.entity.Employee;
import com.nexus.ems.entity.Role;
import com.nexus.ems.entity.User;
import com.nexus.ems.exception.BadRequestException;
import com.nexus.ems.exception.ResourceNotFoundException;
import com.nexus.ems.repository.EmployeeRepository;
import com.nexus.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    public Page<Response.EmployeeResponse> getAll(String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.findAllWithSearch(search, pageable).map(this::toResponse);
    }

    public Response.EmployeeResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public Response.EmployeeResponse getProfile(String email) {
        Employee emp = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for: " + email));
        return toResponse(emp);
    }

    @Transactional
    public Response.EmployeeResponse create(EmployeeRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already in use: " + req.getEmail());
        }

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "changeme123"))
                .phoneNumber(req.getPhoneNumber())
                .role(Role.EMPLOYEE)
                .build();
        user = userRepository.save(user);

        Employee manager = null;
        if (req.getManagerId() != null) {
            manager = findById(req.getManagerId());
        }

        Employee emp = Employee.builder()
                .user(user)
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .age(req.getAge())
                .gender(req.getGender())
                .dateOfBirth(req.getDateOfBirth())
                .joiningDate(req.getJoiningDate())
                .education(req.getEducation())
                .experience(req.getExperience())
                .designation(req.getDesignation())
                .department(req.getDepartment())
                .salary(req.getSalary())
                .manager(manager)
                .build();

        return toResponse(employeeRepository.save(emp));
    }

    @Transactional
    public Response.EmployeeResponse update(Long id, EmployeeRequest req) {
        Employee emp = findById(id);

        emp.setFirstName(req.getFirstName());
        emp.setLastName(req.getLastName());
        emp.setPhoneNumber(req.getPhoneNumber());
        emp.setAddress(req.getAddress());
        emp.setAge(req.getAge());
        emp.setGender(req.getGender());
        emp.setDateOfBirth(req.getDateOfBirth());
        emp.setJoiningDate(req.getJoiningDate());
        emp.setEducation(req.getEducation());
        emp.setExperience(req.getExperience());
        emp.setDesignation(req.getDesignation());
        emp.setDepartment(req.getDepartment());
        emp.setSalary(req.getSalary());

        if (req.getManagerId() != null) {
            emp.setManager(findById(req.getManagerId()));
        }

        // Sync user name
        User user = emp.getUser();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhoneNumber(req.getPhoneNumber());
        userRepository.save(user);

        return toResponse(employeeRepository.save(emp));
    }

    @Transactional
    public Response.EmployeeResponse updateProfile(String email, EmployeeRequest req) {
        Employee emp = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return update(emp.getId(), req);
    }

    @Transactional
    public void delete(Long id) {
        Employee emp = findById(id);
        User user = emp.getUser();
        employeeRepository.delete(emp);
        userRepository.delete(user);
    }

    @Transactional
    public Response.ImageUploadResponse uploadImage(Long id, MultipartFile file) {
        Employee emp = findById(id);

        if (emp.getProfileImageUrl() != null) {
            cloudinaryService.deleteImage(emp.getProfileImageUrl());
        }

        String imageUrl = cloudinaryService.uploadImage(file, "employees");
        emp.setProfileImageUrl(imageUrl);

        // Also update User
        emp.getUser().setProfileImageUrl(imageUrl);
        userRepository.save(emp.getUser());

        employeeRepository.save(emp);
        return Response.ImageUploadResponse.builder()
                .profileImageUrl(imageUrl)
                .message("Profile image updated successfully")
                .build();
    }

    // ── Helpers ────────────────────────────────────────────────

    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
    }

    public Response.EmployeeResponse toResponse(Employee emp) {
        return Response.EmployeeResponse.builder()
                .id(emp.getId())
                .userId(emp.getUser() != null ? emp.getUser().getId() : null)
                .role(emp.getUser() != null ? emp.getUser().getRole() : null)
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .phoneNumber(emp.getPhoneNumber())
                .address(emp.getAddress())
                .age(emp.getAge())
                .gender(emp.getGender())
                .dateOfBirth(emp.getDateOfBirth())
                .joiningDate(emp.getJoiningDate())
                .education(emp.getEducation())
                .experience(emp.getExperience())
                .designation(emp.getDesignation())
                .department(emp.getDepartment())
                .salary(emp.getSalary())
                .profileImageUrl(emp.getProfileImageUrl())
                .managerId(emp.getManager() != null ? emp.getManager().getId() : null)
                .managerName(emp.getManager() != null
                        ? emp.getManager().getFirstName() + " " + emp.getManager().getLastName()
                        : null)
                .createdAt(emp.getCreatedAt())
                .build();
    }
}
