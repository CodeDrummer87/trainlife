package io.nobukata.trainlife.security.rest;

import io.nobukata.trainlife.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private static final Logger log = LoggerFactory.getLogger(AccountController.class);

    private final UserRepository userRepository;

    public AccountController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        return userRepository.findByAccountUsername(authentication.getName())
                .map(u -> {
                    log.debug("Запрос профиля: {}", authentication.getName());
                    return ResponseEntity.ok(Map.of(
                            "userId", u.getId(),
                            "username", u.getAccount().getUsername()));
                })
                .orElseGet(() -> {
                    log.warn("Запрос профиля, но пользователь не был найден: {}", authentication.getName());
                    return ResponseEntity.notFound().build();
                });
    }
}
