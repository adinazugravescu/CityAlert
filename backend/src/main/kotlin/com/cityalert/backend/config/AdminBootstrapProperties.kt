package com.cityalert.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.admin")
data class AdminBootstrapProperties(
    val email: String,
    val password: String,
)
