package com.cityalert.backend.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "ticket_details")
class TicketDetails(
    @Column(length = 255)
    var addressText: String? = null,

    @Column
    var latitude: Double? = null,

    @Column
    var longitude: Double? = null,

    @Column(length = 255)
    var imageUrl: String? = null,

    @OneToOne(mappedBy = "details")
    var ticket: Ticket? = null,
) : BaseEntity()
