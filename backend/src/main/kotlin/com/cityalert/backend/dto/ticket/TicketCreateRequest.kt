package com.cityalert.backend.dto.ticket

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.UUID

data class TicketCreateRequest(
    @field:NotBlank
    @field:Size(max = 150)
    val title: String,

    @field:NotBlank
    val description: String,

    @field:NotNull
    val departmentId: UUID,

    @field:Valid
    val details: TicketDetailsRequest? = null,
)
