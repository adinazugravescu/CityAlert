package com.cityalert.backend.repository

import com.cityalert.backend.model.Feedback
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface FeedbackRepository : JpaRepository<Feedback, UUID> {
    @EntityGraph(attributePaths = ["user"])
    override fun findAll(): List<Feedback>
}
