package com.cityalert.backend.dto.user

import jakarta.validation.constraints.NotEmpty

data class UserRolesUpdateRequest(
    @field:NotEmpty
    val roles: Set<String>,
)
