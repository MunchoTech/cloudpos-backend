package com.cloudpos.cloudpos_backend.repository;
import com.cloudpos.cloudpos_backend.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByEmail(String email);
    Boolean existsByEmail(String email);
}