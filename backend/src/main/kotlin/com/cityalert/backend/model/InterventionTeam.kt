package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "intervention_teams")
class InterventionTeam(
    @Column(nullable = false, unique = true, length = 120)
    var name: String,

    @Column(length = 150)
    var contactEmail: String? = null,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "team_members",
        joinColumns = [JoinColumn(name = "team_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")],
    )
    var members: MutableSet<User> = mutableSetOf(),

    @OneToMany(mappedBy = "assignedTeam", fetch = FetchType.LAZY)
    var tickets: MutableSet<Ticket> = mutableSetOf(),
) : BaseEntity()
