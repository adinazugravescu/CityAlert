package com.cityalert.backend.controller

import com.cityalert.backend.dto.user.UserResponse
import com.cityalert.backend.dto.user.UserRolesUpdateRequest
import com.cityalert.backend.model.User
import com.cityalert.backend.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
class UserController(
    private val userService: UserService,
) {

    @GetMapping
    fun getAll(): List<UserResponse> = userService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): UserResponse = userService.getById(id)

    @PutMapping("/{id}/roles")
    fun updateRoles(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UserRolesUpdateRequest,
    ): UserResponse = userService.updateRoles(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deactivate(
        @PathVariable id: UUID,
        @AuthenticationPrincipal currentUser: User,
    ) {
        userService.deactivate(id, currentUser)
    }
}
