package com.cityalert.backend.repository

import com.cityalert.backend.model.Role
import com.cityalert.backend.model.RoleName
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RoleRepository : JpaRepository<Role, UUID> {
    fun findByName(name: RoleName): Role?
}
