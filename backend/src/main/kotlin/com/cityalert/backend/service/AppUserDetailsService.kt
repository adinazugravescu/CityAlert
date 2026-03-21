package com.cityalert.backend.service

import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AppUserDetailsService(
    private val userRepository: UserRepository,
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByEmail(username)
            ?: throw UsernameNotFoundException("User with email $username not found")

    fun loadDomainUserById(id: UUID) =
        userRepository.findById(id).orElseThrow { NotFoundException("User $id not found") }
}
