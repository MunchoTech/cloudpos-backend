package com.cloudpos.cloudpos_backend.service;


import com.cloudpos.cloudpos_backend.dto.RegisterRequest;
import com.cloudpos.cloudpos_backend.model.Role;
import com.cloudpos.cloudpos_backend.model.Tenant;
import com.cloudpos.cloudpos_backend.model.User;
import com.cloudpos.cloudpos_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantService tenantService;

    public User registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create tenant first
        Tenant tenant = tenantService.createTenant(
                request.getBusinessName(),
                request.getEmail()
        );

        // Create user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setBusinessName(request.getBusinessName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // We'll hash this later
        user.setRole(Role.BUSINESS_OWNER);

        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check subscription status
        if (!tenantService.isSubscriptionActive(email)) {
            throw new RuntimeException("Subscription expired or inactive");
        }

        // Check password (we'll add hashing later)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
