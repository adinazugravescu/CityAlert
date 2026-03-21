package com.cityalert.backend.dto.ticket

import com.cityalert.backend.model.TicketStatus
import jakarta.validation.Valid
import jakarta.validation.constraints.Size
import java.util.UUID

data class TicketUpdateRequest(
    @field:Size(max = 150)
    val title: String? = null,
    val description: String? = null,
    val status: TicketStatus? = null,
    val departmentId: UUID? = null,
    val assignedTeamId: UUID? = null,
    @field:Valid
    val details: TicketDetailsRequest? = null,
)
