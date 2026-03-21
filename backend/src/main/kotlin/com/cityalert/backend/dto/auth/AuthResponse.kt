package com.cityalert.backend.dto.auth

import com.cityalert.backend.dto.user.UserResponse

data class AuthResponse(
    val accessToken: String,
    val tokenType: String = "Bearer",
    val user: UserResponse,
)
