package com.cityalert.backend.dto.feedback

import java.time.Instant
import java.util.UUID

data class FeedbackResponse(
    val id: UUID,
    val category: String,
    val experience: String,
    val contactBack: Boolean,
    val message: String,
    val userId: UUID,
    val userName: String,
    val userEmail: String,
    val createdAt: Instant?,
)
