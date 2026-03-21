package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "departments")
class Department(
    @Column(nullable = false, unique = true, length = 120)
    var name: String,

    @Column(length = 255)
    var description: String? = null,

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    var tickets: MutableSet<Ticket> = mutableSetOf(),
) : BaseEntity()
