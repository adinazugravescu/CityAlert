package com.cityalert.backend.dto.department

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class DepartmentRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:Size(max = 255)
    val description: String? = null,
)
