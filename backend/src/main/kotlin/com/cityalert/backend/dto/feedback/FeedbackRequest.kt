package com.cityalert.backend.dto.feedback

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class FeedbackRequest(
    @field:NotBlank
    @field:Size(max = 100)
    val category: String,

    @field:NotBlank
    @field:Size(max = 50)
    val experience: String,

    val contactBack: Boolean = false,

    @field:NotBlank
    @field:Size(max = 2000)
    val message: String,
)
