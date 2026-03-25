package com.cityalert.backend.service

import com.cityalert.backend.dto.team.InterventionTeamRequest
import com.cityalert.backend.dto.team.InterventionTeamResponse
import com.cityalert.backend.exception.BadRequestException
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.InterventionTeam
import com.cityalert.backend.repository.InterventionTeamRepository
import com.cityalert.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class InterventionTeamService(
    private val teamRepository: InterventionTeamRepository,
    private val userRepository: UserRepository,
    private val dtoMapper: DtoMapper,
) {

    @Transactional(readOnly = true)
    fun getAll(): List<InterventionTeamResponse> =
        teamRepository.findAll()
            .sortedBy { it.name.lowercase() }
            .map(dtoMapper::toTeamResponse)

    @Transactional(readOnly = true)
    fun getById(id: UUID): InterventionTeamResponse = dtoMapper.toTeamResponse(getEntity(id))

    @Transactional
    fun create(request: InterventionTeamRequest): InterventionTeamResponse {
        if (teamRepository.existsByNameIgnoreCase(request.name.trim())) {
            throw BadRequestException("Team name already exists")
        }

        val team = InterventionTeam(
            name = request.name.trim(),
            contactEmail = request.contactEmail?.trim(),
            members = loadMembers(request.memberIds),
        )

        val saved = teamRepository.save(team)
        return dtoMapper.toTeamResponse(getEntity(requireNotNull(saved.id)))
    }

    @Transactional
    fun update(id: UUID, request: InterventionTeamRequest): InterventionTeamResponse {
        val team = getEntity(id)
        val newName = request.name.trim()

        if (!team.name.equals(newName, ignoreCase = true) &&
            teamRepository.existsByNameIgnoreCase(newName)
        ) {
            throw BadRequestException("Team name already exists")
        }

        team.name = newName
        team.contactEmail = request.contactEmail?.trim()
        team.members = loadMembers(request.memberIds)
        val saved = teamRepository.save(team)
        return dtoMapper.toTeamResponse(getEntity(requireNotNull(saved.id)))
    }

    @Transactional
    fun delete(id: UUID) {
        val team = getEntity(id)
        teamRepository.delete(team)
    }

    fun getEntity(id: UUID): InterventionTeam =
        teamRepository.findById(id).orElseThrow { NotFoundException("Team $id not found") }

    private fun loadMembers(memberIds: Set<UUID>) =
        memberIds.map { memberId ->
            userRepository.findById(memberId).orElseThrow { NotFoundException("User $memberId not found") }
        }.toMutableSet()
}
