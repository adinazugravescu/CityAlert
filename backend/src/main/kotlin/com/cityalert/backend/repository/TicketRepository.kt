package com.cityalert.backend.repository

import com.cityalert.backend.model.Ticket
import com.cityalert.backend.model.TicketStatus
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional
import java.util.UUID

interface TicketRepository : JpaRepository<Ticket, UUID> {
    @EntityGraph(attributePaths = ["reporter", "department", "assignedTeam", "details"])
    @Query(
        """
        select t
        from Ticket t
        where t.id = :id
        """,
    )
    fun findDetailedById(@Param("id") id: UUID): Ticket?

    @EntityGraph(attributePaths = ["reporter", "department", "assignedTeam"])
    @Query(
        """
        select t
        from Ticket t
        order by t.createdAt desc
        """,
    )
    fun findAllDetailed(): List<Ticket>

    @EntityGraph(attributePaths = ["reporter", "department", "assignedTeam"])
    fun findAllByReporterIdOrderByCreatedAtDesc(reporterId: UUID): List<Ticket>

    fun findAllByStatus(status: TicketStatus): List<Ticket>

    override fun findById(id: UUID): Optional<Ticket>
}
