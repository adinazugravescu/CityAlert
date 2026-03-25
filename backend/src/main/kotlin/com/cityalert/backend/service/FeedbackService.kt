package com.cityalert.backend.service

import com.cityalert.backend.dto.feedback.FeedbackRequest
import com.cityalert.backend.dto.feedback.FeedbackResponse
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.Feedback
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.FeedbackRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class FeedbackService(
    private val feedbackRepository: FeedbackRepository,
    private val dtoMapper: DtoMapper,
) {

    fun getAll(): List<FeedbackResponse> =
        feedbackRepository.findAll()
            .sortedByDescending { it.createdAt }
            .map(dtoMapper::toFeedbackResponse)

    @Transactional
    fun create(request: FeedbackRequest, currentUser: User): FeedbackResponse {
        val feedback = Feedback(
            category = request.category.trim(),
            experience = request.experience.trim(),
            contactBack = request.contactBack,
            message = request.message.trim(),
            user = currentUser,
        )

        return dtoMapper.toFeedbackResponse(feedbackRepository.save(feedback))
    }

    @Transactional
    fun markContacted(id: UUID): FeedbackResponse {
        val feedback = feedbackRepository.findById(id)
            .orElseThrow { NotFoundException("Feedback $id not found") }
        feedback.contactBack = false
        return dtoMapper.toFeedbackResponse(feedbackRepository.save(feedback))
    }
}
