package com.atlas.config;

import com.atlas.service.RateLimitService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {

    @Bean
    public RateLimitService rateLimitService() {
        return new RateLimitService();
    }
}
