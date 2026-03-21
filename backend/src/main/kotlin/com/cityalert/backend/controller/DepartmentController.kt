package com.cityalert.backend.controller

import com.cityalert.backend.dto.department.DepartmentRequest
import com.cityalert.backend.dto.department.DepartmentResponse
import com.cityalert.backend.service.DepartmentService
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
@RequestMapping("/departments")
class DepartmentController(
    private val departmentService: DepartmentService,
) {

    @GetMapping
    fun getAll(): List<DepartmentResponse> = departmentService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): DepartmentResponse = departmentService.getById(id)

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: DepartmentRequest): DepartmentResponse =
        departmentService.create(request)

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: DepartmentRequest): DepartmentResponse =
        departmentService.update(id, request)

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) {
        departmentService.delete(id)
    }
}
