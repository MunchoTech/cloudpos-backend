package com.cloudpos.cloudpos_backend.service;
import com.cloudpos.cloudpos_backend.model.Tenant;
import com.cloudpos.cloudpos_backend.model.SubscriptionStatus;
import com.cloudpos.cloudpos_backend.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    public Tenant createTenant(String businessName, String email) {
        Tenant tenant = new Tenant();
        tenant.setBusinessName(businessName);
        tenant.setEmail(email);
        tenant.setTrialStartDate(LocalDateTime.now());
        tenant.setSubscriptionStatus(SubscriptionStatus.TRIAL);

        return tenantRepository.save(tenant);
    }

    public boolean isSubscriptionActive(String email) {
        Tenant tenant = tenantRepository.findByEmail(email)
                .orElse(null);

        if (tenant == null) return false;

        // Check if trial period is still valid (14 days trial)
        if (tenant.getSubscriptionStatus() == SubscriptionStatus.TRIAL) {
            LocalDateTime trialEnd = tenant.getTrialStartDate().plusDays(14);
            if (LocalDateTime.now().isAfter(trialEnd)) {
                tenant.setSubscriptionStatus(SubscriptionStatus.EXPIRED);
                tenantRepository.save(tenant);
                return false;
            }
            return true;
        }

        return tenant.getSubscriptionStatus() == SubscriptionStatus.ACTIVE;
    }
}
