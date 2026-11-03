package io.nobukata.trainlife.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails userDetails) {

        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        String token = Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("authorities", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).toList())
                .issuedAt(now)
                .expiration(exp)
                .signWith(getKey())
                .compact();
        log.debug("JWT выпущен для '{}', истекает в {}", userDetails.getUsername(), exp);
        return token;
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = extractClaims(token);
            boolean subjectOk = claims.getSubject().equals(userDetails.getUsername());
            boolean notExpired = claims.getExpiration().after(new Date());
            if (!subjectOk) {
                log.warn("JWT тема '{}' не соответствует пользователю '{}'",
                        claims.getSubject(), userDetails.getUsername());
            }
            if (!notExpired) {
                log.debug("JWT для '{}' истёк", userDetails.getUsername());
            }
            return subjectOk && notExpired;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT парсинг закончился неудачей: {}", e.getMessage());
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload();
    }
}
