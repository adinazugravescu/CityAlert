package com.cityalert.backend.security

import com.cityalert.backend.config.JwtProperties
import com.cityalert.backend.model.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService(
    private val jwtProperties: JwtProperties,
) {
    private val signingKey: SecretKey = Keys.hmacShaKeyFor(jwtProperties.secret.toByteArray(StandardCharsets.UTF_8))

    fun generateToken(user: User): String {
        val now = Instant.now()
        val expiration = now.plus(jwtProperties.accessTokenExpirationMinutes, ChronoUnit.MINUTES)

        return Jwts.builder()
            .subject(user.username)
            .issuer(jwtProperties.issuer)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .claim("roles", user.roles.map { it.name.name })
            .claim("userId", user.id.toString())
            .signWith(signingKey)
            .compact()
    }

    fun extractUsername(token: String): String? = extractAllClaims(token).subject

    fun isTokenValid(token: String, user: User): Boolean =
        extractUsername(token) == user.username && extractAllClaims(token).expiration.after(Date())

    private fun extractAllClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload
}
