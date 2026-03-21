package com.cityalert.backend.dto.ticket

import jakarta.validation.constraints.Size

data class TicketDetailsRequest(
    @field:Size(max = 255)
    val addressText: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    @field:Size(max = 255)
    val imageUrl: String? = null,
)
