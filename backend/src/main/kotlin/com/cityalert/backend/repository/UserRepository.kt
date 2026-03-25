package com.cityalert.backend.repository

import com.cityalert.backend.model.User
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface UserRepository : JpaRepository<User, UUID> {
    @EntityGraph(attributePaths = ["roles"])
    override fun findAll(): List<User>

    @EntityGraph(attributePaths = ["roles"])
    fun findByEmail(email: String): User?

    @EntityGraph(attributePaths = ["roles"])
    override fun findById(id: UUID): Optional<User>

    fun existsByEmail(email: String): Boolean
}
