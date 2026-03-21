package com.cityalert.backend.repository

import com.cityalert.backend.model.Comment
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CommentRepository : JpaRepository<Comment, UUID> {
    @EntityGraph(attributePaths = ["author"])
    fun findAllByTicketIdOrderByCreatedAtAsc(ticketId: UUID): List<Comment>
}
