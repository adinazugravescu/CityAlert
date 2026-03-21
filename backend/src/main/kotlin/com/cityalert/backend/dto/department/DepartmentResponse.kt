package com.cityalert.backend.dto.department

import java.util.UUID

data class DepartmentResponse(
    val id: UUID,
    val name: String,
    val description: String?,
)
