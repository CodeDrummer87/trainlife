package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.IntroduceRequest;
import io.nobukata.trainlife.entity.User;
import io.nobukata.trainlife.repository.UserRepository;
import io.nobukata.trainlife.security.entity.Account;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional  //.:: без save(): сущности в managed-состоянии, Hibernate сделает UPDATE при коммите
    public void introduce(String username, IntroduceRequest req) {
        User user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Не найден пользователь: " + username));

        user.setDepotId(req.locomotiveDepotId());
        user.setPosition(req.position());
        user.setPersonnelNumber(req.personnelNumber());
        user.setLongPersonnelNumber(req.longPersonnelNumber());
        user.setNumberOfColumn(req.numberOfColumn());
        user.setTractionKind(req.tractionKind());
        user.setServiceType(req.serviceType());
        user.setFullName(req.fullName());
        user.setDateOfBirth(req.birthDate());
        user.setNickname(req.nickname());

        Account account = user.getAccount();
        account.setWasIntroduced(true);
    }
}
