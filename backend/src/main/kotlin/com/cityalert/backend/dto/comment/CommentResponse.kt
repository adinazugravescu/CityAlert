package com.cityalert.backend.dto.comment

import java.time.Instant
import java.util.UUID

data class CommentResponse(
    val id: UUID,
    val message: String,
    val authorId: UUID,
    val authorName: String,
    val createdAt: Instant?,
)
