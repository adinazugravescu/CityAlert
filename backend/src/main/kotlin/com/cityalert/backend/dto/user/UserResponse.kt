package com.cityalert.backend.dto.user

import java.time.Instant
import java.util.UUID

data class UserResponse(
    val id: UUID,
    val fullName: String,
    val email: String,
    val roles: Set<String>,
    val active: Boolean,
    val createdAt: Instant?,
)
