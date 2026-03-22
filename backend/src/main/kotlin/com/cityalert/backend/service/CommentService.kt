package com.cityalert.backend.service

import com.cityalert.backend.dto.comment.CommentCreateRequest
import com.cityalert.backend.dto.comment.CommentResponse
import com.cityalert.backend.dto.comment.CommentUpdateRequest
import com.cityalert.backend.exception.ForbiddenException
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.Comment
import com.cityalert.backend.model.RoleName
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.CommentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val ticketService: TicketService,
    private val dtoMapper: DtoMapper,
) {

    fun getByTicket(ticketId: UUID, currentUser: User): List<CommentResponse> {
        ticketService.assertTicketAccess(ticketId, currentUser)
        return commentRepository.findAllByTicketIdOrderByCreatedAtAsc(ticketId).map(dtoMapper::toCommentResponse)
    }

    @Transactional
    fun create(ticketId: UUID, request: CommentCreateRequest, currentUser: User): CommentResponse {
        val ticket = ticketService.getEntity(ticketId)
        val isPrivileged = currentUser.roles.any { it.name == RoleName.EMPLOYEE || it.name == RoleName.ADMIN }
        val isReporter = ticket.reporter.id == currentUser.id

        if (!isPrivileged && !isReporter) {
            throw ForbiddenException("You are not allowed to comment on this ticket")
        }

        val savedComment = commentRepository.save(
            Comment(
                message = request.message.trim(),
                ticket = ticket,
                author = currentUser,
            ),
        )

        return dtoMapper.toCommentResponse(savedComment)
    }

    @Transactional
    fun update(ticketId: UUID, commentId: UUID, request: CommentUpdateRequest, currentUser: User): CommentResponse {
        val comment = getComment(ticketId, commentId)
        assertCanManageComment(comment, currentUser)
        comment.message = request.message.trim()
        return dtoMapper.toCommentResponse(commentRepository.save(comment))
    }

    @Transactional
    fun delete(ticketId: UUID, commentId: UUID, currentUser: User) {
        val comment = getComment(ticketId, commentId)
        assertCanManageComment(comment, currentUser)
        commentRepository.delete(comment)
    }

    private fun getComment(ticketId: UUID, commentId: UUID): Comment {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { NotFoundException("Comment $commentId not found") }

        if (comment.ticket.id != ticketId) {
            throw NotFoundException("Comment $commentId does not belong to ticket $ticketId")
        }

        return comment
    }

    private fun assertCanManageComment(comment: Comment, currentUser: User) {
        val isPrivileged = currentUser.roles.any { it.name == RoleName.EMPLOYEE || it.name == RoleName.ADMIN }
        val isAuthor = comment.author.id == currentUser.id

        if (!isPrivileged && !isAuthor) {
            throw ForbiddenException("You are not allowed to modify this comment")
        }
    }
}
