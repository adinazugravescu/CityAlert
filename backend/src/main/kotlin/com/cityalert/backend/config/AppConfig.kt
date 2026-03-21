package com.cityalert.backend.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(
    value = [
        JwtProperties::class,
        AdminBootstrapProperties::class,
        MailProperties::class,
    ],
)
class AppConfig
