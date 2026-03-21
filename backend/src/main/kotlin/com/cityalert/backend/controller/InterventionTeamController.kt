package com.cityalert.backend.controller

import com.cityalert.backend.dto.team.InterventionTeamRequest
import com.cityalert.backend.dto.team.InterventionTeamResponse
import com.cityalert.backend.service.InterventionTeamService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
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
@RequestMapping("/teams")
@PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
class InterventionTeamController(
    private val interventionTeamService: InterventionTeamService,
) {

    @GetMapping
    fun getAll(): List<InterventionTeamResponse> = interventionTeamService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): InterventionTeamResponse = interventionTeamService.getById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: InterventionTeamRequest): InterventionTeamResponse =
        interventionTeamService.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: InterventionTeamRequest): InterventionTeamResponse =
        interventionTeamService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) {
        interventionTeamService.delete(id)
    }
}
