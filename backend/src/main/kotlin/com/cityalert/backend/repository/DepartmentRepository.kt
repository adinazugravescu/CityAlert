package com.cityalert.backend.repository

import com.cityalert.backend.model.Department
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface DepartmentRepository : JpaRepository<Department, UUID> {
    fun existsByNameIgnoreCase(name: String): Boolean
}
