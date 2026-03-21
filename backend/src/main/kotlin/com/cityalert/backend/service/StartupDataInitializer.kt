package com.cityalert.backend.service

import com.cityalert.backend.config.AdminBootstrapProperties
import com.cityalert.backend.model.Role
import com.cityalert.backend.model.RoleName
import com.cityalert.backend.model.User
import com.cityalert.backend.repository.RoleRepository
import com.cityalert.backend.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class StartupDataInitializer(
    private val roleRepository: RoleRepository,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val adminBootstrapProperties: AdminBootstrapProperties,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        RoleName.entries.forEach { roleName ->
            if (roleRepository.findByName(roleName) == null) {
                roleRepository.save(Role(name = roleName))
            }
        }

        if (!userRepository.existsByEmail(adminBootstrapProperties.email.lowercase())) {
            val adminRole = roleRepository.findByName(RoleName.ADMIN) ?: return
            val employeeRole = roleRepository.findByName(RoleName.EMPLOYEE) ?: return

            userRepository.save(
                User(
                    fullName = "CityAlert Admin",
                    email = adminBootstrapProperties.email.lowercase(),
                    passwordHash = passwordEncoder.encode(adminBootstrapProperties.password),
                    roles = mutableSetOf(adminRole, employeeRole),
                ),
            )
        }
    }
}
