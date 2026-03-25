package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "feedback")
class Feedback(
    @Column(nullable = false, length = 100)
    var category: String,

    @Column(nullable = false, length = 50)
    var experience: String,

    @Column(nullable = false)
    var contactBack: Boolean = false,

    @Column(nullable = false, columnDefinition = "TEXT")
    var message: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,
) : BaseEntity()
