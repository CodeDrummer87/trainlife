package io.nobukata.trainlife.exception;

import io.nobukata.trainlife.exception.user.LongPersonnelNumberExistsException;
import io.nobukata.trainlife.exception.user.NicknameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(NicknameAlreadyExistsException.class)
    public ResponseEntity<?> handleNicknameExists(NicknameAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(LongPersonnelNumberExistsException.class)
    public ResponseEntity<?> handleLongPersonnelNumberExists(LongPersonnelNumberExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }
}
