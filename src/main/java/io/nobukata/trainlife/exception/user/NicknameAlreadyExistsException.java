package io.nobukata.trainlife.exception.user;

public class NicknameAlreadyExistsException extends RuntimeException {

    public NicknameAlreadyExistsException(String message) {
        super(message);
    }
}
