package com.cityalert.backend.service

import com.cityalert.backend.dto.department.DepartmentRequest
import com.cityalert.backend.dto.department.DepartmentResponse
import com.cityalert.backend.exception.BadRequestException
import com.cityalert.backend.exception.NotFoundException
import com.cityalert.backend.model.Department
import com.cityalert.backend.repository.DepartmentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class DepartmentService(
    private val departmentRepository: DepartmentRepository,
    private val dtoMapper: DtoMapper,
) {

    fun getAll(): List<DepartmentResponse> =
        departmentRepository.findAll()
            .sortedBy { it.name.lowercase() }
            .map(dtoMapper::toDepartmentResponse)

    fun getById(id: UUID): DepartmentResponse = dtoMapper.toDepartmentResponse(getEntity(id))

    @Transactional
    fun create(request: DepartmentRequest): DepartmentResponse {
        if (departmentRepository.existsByNameIgnoreCase(request.name.trim())) {
            throw BadRequestException("Department name already exists")
        }

        val department = Department(
            name = request.name.trim(),
            description = request.description?.trim(),
        )

        return dtoMapper.toDepartmentResponse(departmentRepository.save(department))
    }

    @Transactional
    fun update(id: UUID, request: DepartmentRequest): DepartmentResponse {
        val department = getEntity(id)
        val newName = request.name.trim()
        if (!department.name.equals(newName, ignoreCase = true) &&
            departmentRepository.existsByNameIgnoreCase(newName)
        ) {
            throw BadRequestException("Department name already exists")
        }

        department.name = newName
        department.description = request.description?.trim()
        return dtoMapper.toDepartmentResponse(departmentRepository.save(department))
    }

    @Transactional
    fun delete(id: UUID) {
        val department = getEntity(id)
        departmentRepository.delete(department)
    }

    fun getEntity(id: UUID): Department =
        departmentRepository.findById(id).orElseThrow { NotFoundException("Department $id not found") }
}
