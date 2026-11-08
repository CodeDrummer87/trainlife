package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.IntroduceRequest;
import io.nobukata.trainlife.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/introduce")
    public ResponseEntity<Map<String, String>> introduce(@Valid @RequestBody IntroduceRequest req, Authentication auth) {
        userService.introduce(auth.getName(), req);
        return ResponseEntity.ok(Map.of("message", "Данные сохранены. Спасибо!"));
    }
}
