package com.cityalert.backend.dto.team

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class InterventionTeamRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:Email
    @field:Size(max = 150)
    val contactEmail: String? = null,

    val memberIds: Set<UUID> = emptySet(),
)
