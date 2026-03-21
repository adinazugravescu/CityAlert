package com.cityalert.backend.service

import com.cityalert.backend.dto.comment.CommentResponse
import com.cityalert.backend.dto.department.DepartmentResponse
import com.cityalert.backend.dto.team.InterventionTeamResponse
import com.cityalert.backend.dto.ticket.TicketDetailsResponse
import com.cityalert.backend.dto.ticket.TicketResponse
import com.cityalert.backend.dto.user.UserResponse
import com.cityalert.backend.model.Comment
import com.cityalert.backend.model.Department
import com.cityalert.backend.model.InterventionTeam
import com.cityalert.backend.model.Ticket
import com.cityalert.backend.model.TicketDetails
import com.cityalert.backend.model.User
import org.springframework.stereotype.Component

@Component
class DtoMapper {

    fun toUserResponse(user: User): UserResponse =
        UserResponse(
            id = requireNotNull(user.id),
            fullName = user.fullName,
            email = user.email(),
            roles = user.roles.map { it.name.name }.toSet(),
            active = user.active,
            createdAt = user.createdAt,
        )

    fun toDepartmentResponse(department: Department): DepartmentResponse =
        DepartmentResponse(
            id = requireNotNull(department.id),
            name = department.name,
            description = department.description,
        )

    fun toTeamResponse(team: InterventionTeam): InterventionTeamResponse =
        InterventionTeamResponse(
            id = requireNotNull(team.id),
            name = team.name,
            contactEmail = team.contactEmail,
            members = team.members.map(::toUserResponse).sortedBy { it.fullName },
        )

    fun toCommentResponse(comment: Comment): CommentResponse =
        CommentResponse(
            id = requireNotNull(comment.id),
            message = comment.message,
            authorId = requireNotNull(comment.author.id),
            authorName = comment.author.fullName,
            createdAt = comment.createdAt,
        )

    fun toTicketDetailsResponse(details: TicketDetails): TicketDetailsResponse =
        TicketDetailsResponse(
            id = requireNotNull(details.id),
            addressText = details.addressText,
            latitude = details.latitude,
            longitude = details.longitude,
            imageUrl = details.imageUrl,
        )

    fun toTicketResponse(ticket: Ticket, comments: List<CommentResponse> = emptyList()): TicketResponse =
        TicketResponse(
            id = requireNotNull(ticket.id),
            title = ticket.title,
            description = ticket.description,
            status = ticket.status,
            reporterId = requireNotNull(ticket.reporter.id),
            reporterName = ticket.reporter.fullName,
            departmentId = requireNotNull(ticket.department.id),
            departmentName = ticket.department.name,
            assignedTeamId = ticket.assignedTeam?.id,
            assignedTeamName = ticket.assignedTeam?.name,
            details = ticket.details?.let(::toTicketDetailsResponse),
            comments = comments,
            createdAt = ticket.createdAt,
            updatedAt = ticket.updatedAt,
        )
}
