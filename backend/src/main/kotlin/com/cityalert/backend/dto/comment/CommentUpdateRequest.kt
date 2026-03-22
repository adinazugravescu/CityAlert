package com.cityalert.backend.dto.comment

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CommentUpdateRequest(
    @field:NotBlank
    @field:Size(max = 500)
    val message: String,
)
