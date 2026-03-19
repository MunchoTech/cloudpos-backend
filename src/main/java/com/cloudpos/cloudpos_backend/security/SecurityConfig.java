package com.cloudpos.cloudpos_backend.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll()  // Allow all auth endpoints
                        .anyRequest().authenticated()  // All other requests need authentication
                )
                .httpBasic(httpBasic -> httpBasic.disable())  // Disable basic auth
                .formLogin(formLogin -> formLogin.disable());  // Disable form login

        return http.build();
    }
}