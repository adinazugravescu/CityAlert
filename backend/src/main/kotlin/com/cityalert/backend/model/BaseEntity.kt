package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.UUID

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity(
    @Id
    @GeneratedValue
    @UuidGenerator
    open var id: UUID? = null,

    @CreatedDate
    @Column(nullable = false, updatable = false)
    open var createdAt: Instant? = null,

    @LastModifiedDate
    @Column(nullable = false)
    open var updatedAt: Instant? = null,
)
