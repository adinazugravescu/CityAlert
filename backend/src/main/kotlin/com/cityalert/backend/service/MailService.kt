package com.cityalert.backend.service

import com.cityalert.backend.config.MailProperties
import com.cityalert.backend.model.Ticket
import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class MailService(
    private val mailSender: JavaMailSender,
    private val mailProperties: MailProperties,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    fun sendTicketResolvedNotification(ticket: Ticket) {
        val email = ticket.reporter.email()
        val message = SimpleMailMessage().apply {
            from = mailProperties.from
            setTo(email)
            subject = "Ticket resolved: ${ticket.title}"
            text = """
                Hello ${ticket.reporter.fullName},

                Your incident report "${ticket.title}" has been marked as RESOLVED.

                You can review the latest updates in the CityAlert application.
            """.trimIndent()
        }

        runCatching { mailSender.send(message) }
            .onFailure { ex -> logger.warn("Failed to send MailTrap notification for ticket {}", ticket.id, ex) }
    }
}
