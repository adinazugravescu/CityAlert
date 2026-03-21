package com.cityalert.backend.service

import com.cityalert.backend.dto.comment.CommentResponse
import com.cityalert.backend.dto.ticket.TicketCreateRequest
import com.cityalert.backend.dto.ticket.TicketDetailsRequest
import com.cityalert.backend.dto.ticket.TicketResponse
import com.cityalert.backend.dto.ticket.TicketUpdateRequest
import com.cityalert.backend.exception.ForbiddenException
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.RoleName
import com.cityalert.backend.model.Ticket
import com.cityalert.backend.model.TicketDetails
import com.cityalert.backend.model.TicketStatus
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.CommentRepository
import com.cityalert.backend.repository.TicketRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TicketService(
    private val ticketRepository: TicketRepository,
    private val departmentService: DepartmentService,
    private val teamService: InterventionTeamService,
    private val commentRepository: CommentRepository,
    private val mailService: MailService,
    private val dtoMapper: DtoMapper,
) {

    fun getAll(currentUser: User): List<TicketResponse> {
        val isPrivileged = hasPrivilegedRole(currentUser)
        val tickets = if (isPrivileged) {
            ticketRepository.findAllDetailed()
        } else {
            ticketRepository.findAllByReporterIdOrderByCreatedAtDesc(requireNotNull(currentUser.id))
        }

        return tickets.map(::toTicketResponseWithComments)
    }

    fun getById(id: UUID, currentUser: User): TicketResponse {
        assertTicketAccess(id, currentUser)
        val ticket = ticketRepository.findDetailedById(id) ?: throw NotFoundException("Ticket $id not found")
        return toTicketResponseWithComments(ticket)
    }

    @Transactional
    fun create(request: TicketCreateRequest, currentUser: User): TicketResponse {
        val department = departmentService.getEntity(request.departmentId)
        val ticket = Ticket(
            title = request.title.trim(),
            description = request.description.trim(),
            reporter = currentUser,
            department = department,
            details = request.details?.toEntity(),
        )

        val saved = ticketRepository.save(ticket)
        return toTicketResponseWithComments(saved)
    }

    @Transactional
    fun update(id: UUID, request: TicketUpdateRequest, currentUser: User): TicketResponse {
        val ticket = getEntity(id)
        if (!hasPrivilegedRole(currentUser)) {
            throw ForbiddenException("Only employees or admins can update tickets")
        }

        val previousStatus = ticket.status

        request.title?.let { ticket.title = it.trim() }
        request.description?.let { ticket.description = it.trim() }
        request.status?.let { ticket.status = it }
        request.departmentId?.let { ticket.department = departmentService.getEntity(it) }
        if (request.assignedTeamId != null) {
            ticket.assignedTeam = teamService.getEntity(request.assignedTeamId)
        }
        request.details?.let { ticket.details = it.toEntity(ticket.details) }

        val saved = ticketRepository.save(ticket)

        if (previousStatus != TicketStatus.RESOLVED && saved.status == TicketStatus.RESOLVED) {
            mailService.sendTicketResolvedNotification(saved)
        }

        return toTicketResponseWithComments(saved)
    }

    @Transactional
    fun delete(id: UUID) {
        val ticket = getEntity(id)
        ticketRepository.delete(ticket)
    }

    fun getEntity(id: UUID): Ticket =
        ticketRepository.findDetailedById(id) ?: throw NotFoundException("Ticket $id not found")

    fun assertTicketAccess(ticketId: UUID, currentUser: User) {
        val ticket = getEntity(ticketId)
        val isOwner = ticket.reporter.id == currentUser.id
        if (!hasPrivilegedRole(currentUser) && !isOwner) {
            throw ForbiddenException("You are not allowed to access this ticket")
        }
    }

    private fun hasPrivilegedRole(user: User): Boolean =
        user.roles.any { it.name == RoleName.EMPLOYEE || it.name == RoleName.ADMIN }

    private fun toTicketResponseWithComments(ticket: Ticket): TicketResponse {
        val comments: List<CommentResponse> =
            commentRepository.findAllByTicketIdOrderByCreatedAtAsc(requireNotNull(ticket.id)).map(dtoMapper::toCommentResponse)
        return dtoMapper.toTicketResponse(ticket, comments)
    }

    private fun TicketDetailsRequest.toEntity(existing: TicketDetails? = null): TicketDetails =
        (existing ?: TicketDetails()).apply {
            addressText = this@toEntity.addressText?.trim()
            latitude = this@toEntity.latitude
            longitude = this@toEntity.longitude
            imageUrl = this@toEntity.imageUrl?.trim()
        }
}
