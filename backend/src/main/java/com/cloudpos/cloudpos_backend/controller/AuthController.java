package com.cloudpos.cloudpos_backend.controller;

import com.cloudpos.cloudpos_backend.dto.ApiResponse;
import com.cloudpos.cloudpos_backend.dto.JwtResponse;
import com.cloudpos.cloudpos_backend.dto.LoginRequest;
import com.cloudpos.cloudpos_backend.dto.RegisterRequest;
import com.cloudpos.cloudpos_backend.model.User;
import com.cloudpos.cloudpos_backend.service.AuthService;
import com.cloudpos.cloudpos_backend.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TenantService tenantService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            user.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Registration successful! Your trial has started.",
                    user
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/check-subscription")
    public ResponseEntity<?> checkSubscription(@RequestParam String email) {
        try {
            boolean isActive = tenantService.isSubscriptionActive(email);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    isActive ? "Subscription active" : "Subscription inactive",
                    isActive
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}