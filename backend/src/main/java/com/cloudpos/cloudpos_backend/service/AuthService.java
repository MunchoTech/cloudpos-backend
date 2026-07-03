package com.cloudpos.cloudpos_backend.service;

import com.cloudpos.cloudpos_backend.dto.JwtResponse;
import com.cloudpos.cloudpos_backend.dto.RegisterRequest;
import com.cloudpos.cloudpos_backend.model.Role;
import com.cloudpos.cloudpos_backend.model.Tenant;
import com.cloudpos.cloudpos_backend.model.User;
import com.cloudpos.cloudpos_backend.repository.UserRepository;
import com.cloudpos.cloudpos_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Tenant tenant = tenantService.createTenant(
                request.getBusinessName(),
                request.getEmail()
        );

        User user = new User();
        user.setFullName(request.getFullName());
        user.setBusinessName(request.getBusinessName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password
        user.setRole(Role.BUSINESS_OWNER);

        return userRepository.save(user);
    }

    public JwtResponse authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!tenantService.isSubscriptionActive(email)) {
            throw new RuntimeException("Subscription expired or inactive");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().toString());

        return new JwtResponse(token, user.getId(), user.getEmail(),
                user.getFullName(), user.getBusinessName(), user.getRole().toString());
    }
}