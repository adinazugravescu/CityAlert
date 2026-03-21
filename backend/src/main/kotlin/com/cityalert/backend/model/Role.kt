package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

@Entity
@Table(name = "roles")
class Role(
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    var name: RoleName,
) : BaseEntity()
