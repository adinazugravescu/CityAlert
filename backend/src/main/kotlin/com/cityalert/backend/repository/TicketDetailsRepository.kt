package com.cityalert.backend.repository

import com.cityalert.backend.model.TicketDetails
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface TicketDetailsRepository : JpaRepository<TicketDetails, UUID>
