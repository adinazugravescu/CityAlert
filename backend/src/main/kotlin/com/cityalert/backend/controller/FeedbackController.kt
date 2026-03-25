package com.cityalert.backend.controller

import com.cityalert.backend.dto.feedback.FeedbackRequest
import com.cityalert.backend.dto.feedback.FeedbackResponse
import com.cityalert.backend.model.User
import com.cityalert.backend.service.FeedbackService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/feedback")
class FeedbackController(
    private val feedbackService: FeedbackService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody request: FeedbackRequest,
        @AuthenticationPrincipal currentUser: User,
    ): FeedbackResponse = feedbackService.create(request, currentUser)

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    fun getAll(): List<FeedbackResponse> = feedbackService.getAll()

    @PutMapping("/{id}/contacted")
    @PreAuthorize("hasRole('ADMIN')")
    fun markContacted(@PathVariable id: UUID): FeedbackResponse = feedbackService.markContacted(id)
}
