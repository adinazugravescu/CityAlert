package com.cityalert.backend.controller

import com.cityalert.backend.dto.comment.CommentCreateRequest
import com.cityalert.backend.dto.comment.CommentResponse
import com.cityalert.backend.dto.comment.CommentUpdateRequest
import com.cityalert.backend.model.User
import com.cityalert.backend.service.CommentService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/tickets/{ticketId}/comments")
class CommentController(
    private val commentService: CommentService,
) {

    @GetMapping
    fun getByTicket(
        @PathVariable ticketId: UUID,
        @AuthenticationPrincipal currentUser: User,
    ): List<CommentResponse> = commentService.getByTicket(ticketId, currentUser)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable ticketId: UUID,
        @Valid @RequestBody request: CommentCreateRequest,
        @AuthenticationPrincipal currentUser: User,
    ): CommentResponse = commentService.create(ticketId, request, currentUser)

    @PutMapping("/{commentId}")
    fun update(
        @PathVariable ticketId: UUID,
        @PathVariable commentId: UUID,
        @Valid @RequestBody request: CommentUpdateRequest,
        @AuthenticationPrincipal currentUser: User,
    ): CommentResponse = commentService.update(ticketId, commentId, request, currentUser)

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable ticketId: UUID,
        @PathVariable commentId: UUID,
        @AuthenticationPrincipal currentUser: User,
    ) {
        commentService.delete(ticketId, commentId, currentUser)
    }
}
