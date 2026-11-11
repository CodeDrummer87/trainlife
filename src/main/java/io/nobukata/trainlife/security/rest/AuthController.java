package io.nobukata.trainlife.security.rest;

import io.nobukata.trainlife.security.dto.LoginRequest;
import io.nobukata.trainlife.security.dto.RegisterRequest;
import io.nobukata.trainlife.security.entity.Account;
import io.nobukata.trainlife.security.service.AccountService;
import io.nobukata.trainlife.security.service.JwtService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;
    private final JwtService jwtService;

    @Value("${jwt.cookie-name}")
    private String cookieName;

    @Value("${jwt.cookie-max-age}")
    private int cookieMaxAge;

    @Value("${jwt.cookie-http-only}")
    private boolean httpOnly;

    @Value("${jwt.cookie-secure}")
    private boolean secure;

    public AuthController(AuthenticationManager authenticationManager,
                          AccountService accountService,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password()));

            UserDetails user = (UserDetails) auth.getPrincipal();
            String token = jwtService.generateToken(user);
            ResponseCookie cookie = buildCookie(token);

            log.info("Успешный вход в систему пользователя: {}", req.username());
            Account account = (Account) auth.getPrincipal();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
                            "username", user.getUsername(),
                            "role", Objects.requireNonNull(user.getAuthorities().iterator().next().getAuthority()),
                            "wasIntroduced", account.getWasIntroduced()));
        } catch (BadCredentialsException e) {
            log.debug("Ошибка входа в систему (неверные учётные данные): {}", req.username());
            throw e;   //.:: 401 от GlobalExceptionHandler
        } catch (DisabledException | LockedException e) {
            log.debug("Ошибка входа в систему ({}): {}", e.getClass().getSimpleName(), req.username());
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication) {
        if (authentication != null) {
            log.info("Выход из системы: {}", authentication.getName());
        }
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(httpOnly).secure(secure).path("/").maxAge(0).build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Вы вышли из системы"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        accountService.register(req.username(), req.password());
        log.info("Запрос на регистрацию завершён: {}", req.username());
        return ResponseEntity.ok(Map.of("message", "Вы зарегистрированы"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails ud)) {
            return ResponseEntity.status(401).body(Map.of("error", "unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "username", ud.getUsername(),
                "role", ud.getAuthorities().iterator().next().getAuthority()));
    }

    private ResponseCookie buildCookie(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(httpOnly)
                .secure(secure)
                .path("/")
                .maxAge(cookieMaxAge)
                .sameSite("Lax")
                .build();
    }
}
