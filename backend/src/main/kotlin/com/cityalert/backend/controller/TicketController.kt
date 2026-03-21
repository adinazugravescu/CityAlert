package com.cityalert.backend.controller

import com.cityalert.backend.dto.ticket.TicketCreateRequest
import com.cityalert.backend.dto.ticket.TicketResponse
import com.cityalert.backend.dto.ticket.TicketUpdateRequest
import com.cityalert.backend.model.User
import com.cityalert.backend.service.TicketService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
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
@RequestMapping("/tickets")
class TicketController(
    private val ticketService: TicketService,
) {

    @GetMapping
    fun getAll(@AuthenticationPrincipal currentUser: User): List<TicketResponse> =
        ticketService.getAll(currentUser)

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID, @AuthenticationPrincipal currentUser: User): TicketResponse =
        ticketService.getById(id, currentUser)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody request: TicketCreateRequest,
        @AuthenticationPrincipal currentUser: User,
    ): TicketResponse = ticketService.create(request, currentUser)

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: TicketUpdateRequest,
        @AuthenticationPrincipal currentUser: User,
    ): TicketResponse = ticketService.update(id, request, currentUser)

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) {
        ticketService.delete(id)
    }
}
