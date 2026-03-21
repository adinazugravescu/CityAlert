package com.cityalert.backend.dto.ticket

import java.util.UUID

data class TicketDetailsResponse(
    val id: UUID,
    val addressText: String?,
    val latitude: Double?,
    val longitude: Double?,
    val imageUrl: String?,
)
