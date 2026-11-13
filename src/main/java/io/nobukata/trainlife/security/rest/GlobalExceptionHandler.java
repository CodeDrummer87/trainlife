package io.nobukata.trainlife.security.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> badCredentials(BadCredentialsException e,  HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Некорректный логин или пароль",
                        "timestamp", Instant.now().toString(),
                        "path", request.getRequestURI()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> userNotFound(UsernameNotFoundException e) {
        log.debug("Пользователь не существует: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Некорректный логин или пароль"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> illegalArg(IllegalArgumentException e) {
        log.debug("Неверный запрос");
        return ResponseEntity.badRequest().body(Map.of("error", "Пользователь с таким логином уже существует"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.debug("Невалидные данные: {}", msg);
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> disabled(DisabledException e) {
        log.warn("Попытка входа в отключённый аккаунт");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Аккаунт отключён"));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<?> locked(LockedException e) {
        log.warn("Попытка входа в заблокированный аккаунт");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Аккаунт заблокирован"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> unreadable(HttpMessageNotReadableException e) {
        log.debug("Нечитаемое тело запроса: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("error", "Некорректный формат запроса"));
    }
}
