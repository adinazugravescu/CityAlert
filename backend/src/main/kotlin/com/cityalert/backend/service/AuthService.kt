package com.cityalert.backend.service

import com.cityalert.backend.dto.auth.AuthResponse
import com.cityalert.backend.dto.auth.LoginRequest
import com.cityalert.backend.dto.auth.RegisterRequest
import com.cityalert.backend.exception.BadRequestException
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.RoleName
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.RoleRepository
import com.cityalert.backend.repository.UserRepository
import com.cityalert.backend.security.JwtService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtService: JwtService,
    private val dtoMapper: DtoMapper,
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email.lowercase())) {
            throw BadRequestException("An account with this email already exists")
        }

        val citizenRole = roleRepository.findByName(RoleName.CITIZEN)
            ?: throw NotFoundException("Default role CITIZEN was not found")

        val savedUser = userRepository.save(
            User(
                fullName = request.fullName.trim(),
                email = request.email.lowercase(),
                passwordHash = passwordEncoder.encode(request.password),
                roles = mutableSetOf(citizenRole),
            ),
        )

        return buildAuthResponse(savedUser)
    }

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email.lowercase(), request.password),
        )

        val user = userRepository.findByEmail(request.email.lowercase())
            ?: throw NotFoundException("User not found")

        return buildAuthResponse(user)
    }

    private fun buildAuthResponse(user: User): AuthResponse =
        AuthResponse(
            accessToken = jwtService.generateToken(user),
            user = dtoMapper.toUserResponse(user),
        )
}
