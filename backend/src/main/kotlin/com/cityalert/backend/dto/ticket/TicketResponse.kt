package com.cityalert.backend.dto.ticket

import com.cityalert.backend.dto.comment.CommentResponse
import com.cityalert.backend.model.TicketStatus
import java.time.Instant
import java.util.UUID

data class TicketResponse(
    val id: UUID,
    val title: String,
    val description: String,
    val status: TicketStatus,
    val reporterId: UUID,
    val reporterName: String,
    val departmentId: UUID,
    val departmentName: String,
    val assignedTeamId: UUID?,
    val assignedTeamName: String?,
    val details: TicketDetailsResponse?,
    val comments: List<CommentResponse>,
    val createdAt: Instant?,
    val updatedAt: Instant?,
)
