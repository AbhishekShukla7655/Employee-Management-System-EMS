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

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private final EmployeeService employeeService;

    public Page<Response.EmployeeResponse> getAll(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        // Managers are employees whose user.role = MANAGER
        return employeeRepository.findAllWithSearch(search, pageable)
                .map(employeeService::toResponse)
                .map(r -> r); // filtered in query or can add role filter
    }

    public Response.EmployeeResponse getById(Long id) {
        return employeeService.toResponse(employeeService.findById(id));
    }

    public Response.EmployeeResponse getProfile(String email) {
        Employee emp = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Manager profile not found"));
        return employeeService.toResponse(emp);
    }

    public List<Response.EmployeeResponse> getTeam(String managerEmail) {
        Employee manager = employeeRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        return employeeRepository.findByManager(manager)
                .stream().map(employeeService::toResponse).toList();
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
                .role(Role.MANAGER)
                .build();
        user = userRepository.save(user);

        Employee emp = Employee.builder()
                .user(user)
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .designation(req.getDesignation())
                .department(req.getDepartment())
                .salary(req.getSalary())
                .joiningDate(req.getJoiningDate())
                .build();

        return employeeService.toResponse(employeeRepository.save(emp));
    }

    @Transactional
    public Response.EmployeeResponse update(Long id, EmployeeRequest req) {
        return employeeService.update(id, req);
    }

    @Transactional
    public void delete(Long id) {
        employeeService.delete(id);
    }

    @Transactional
    public Response.ImageUploadResponse uploadImage(Long id, MultipartFile file) {
        return employeeService.uploadImage(id, file);
    }
}
