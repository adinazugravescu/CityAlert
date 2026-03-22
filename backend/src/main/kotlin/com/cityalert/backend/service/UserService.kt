package com.cityalert.backend.service

import com.cityalert.backend.dto.user.UserResponse
import com.cityalert.backend.dto.user.UserRolesUpdateRequest
import com.cityalert.backend.exception.BadRequestException
import com.cityalert.backend.exception.ForbiddenException
import com.cityalert.backend.model.RoleName
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.RoleRepository
import com.cityalert.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val appUserDetailsService: AppUserDetailsService,
    private val dtoMapper: DtoMapper,
) {

    fun getAll(): List<UserResponse> =
        userRepository.findAll()
            .sortedBy { it.fullName.lowercase() }
            .map(dtoMapper::toUserResponse)

    fun getById(id: UUID): UserResponse = dtoMapper.toUserResponse(appUserDetailsService.loadDomainUserById(id))

    @Transactional
    fun updateRoles(id: UUID, request: UserRolesUpdateRequest): UserResponse {
        val user = appUserDetailsService.loadDomainUserById(id)
        val roles = request.roles.map { rawRole ->
            val roleName = runCatching { RoleName.valueOf(rawRole.trim().uppercase()) }
                .getOrElse { throw BadRequestException("Invalid role: $rawRole") }
            roleRepository.findByName(roleName)
                ?: throw BadRequestException("Role $roleName not found in database")
        }.toMutableSet()

        user.roles = roles
        return dtoMapper.toUserResponse(userRepository.save(user))
    }

    @Transactional
    fun deactivate(id: UUID, currentUser: User) {
        if (currentUser.id == id) {
            throw ForbiddenException("You cannot deactivate your own account")
        }

        val user = appUserDetailsService.loadDomainUserById(id)
        user.active = false
        userRepository.save(user)
    }
}
