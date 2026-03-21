package com.cityalert.backend.repository

import com.cityalert.backend.model.InterventionTeam
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface InterventionTeamRepository : JpaRepository<InterventionTeam, UUID> {
    fun existsByNameIgnoreCase(name: String): Boolean

    @EntityGraph(attributePaths = ["members"])
    override fun findAll(): List<InterventionTeam>

    @EntityGraph(attributePaths = ["members"])
    override fun findById(id: UUID): Optional<InterventionTeam>
}
