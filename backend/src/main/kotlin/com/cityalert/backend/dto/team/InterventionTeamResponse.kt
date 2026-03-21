package com.cityalert.backend.dto.team

import com.cityalert.backend.dto.user.UserResponse
import java.util.UUID

data class InterventionTeamResponse(
    val id: UUID,
    val name: String,
    val contactEmail: String?,
    val members: List<UserResponse>,
)
