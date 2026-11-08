package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.IntroduceRequest;
import io.nobukata.trainlife.entity.User;
import io.nobukata.trainlife.repository.*;
import io.nobukata.trainlife.security.entity.Account;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PositionRepository positionRepository;
    private final TractionKindRepository tractionKindRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final LocomotiveDepotRepository locomotiveDepotRepository;

    public UserService(UserRepository userRepository,
                       PositionRepository positionRepository,
                       TractionKindRepository tractionKindRepository,
                       ServiceTypeRepository serviceTypeRepository,
                       LocomotiveDepotRepository locomotiveDepotRepository) {
        this.userRepository = userRepository;
        this.positionRepository = positionRepository;
        this.tractionKindRepository = tractionKindRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.locomotiveDepotRepository = locomotiveDepotRepository;
    }

    @Transactional  //.:: без save(): сущности в managed-состоянии, Hibernate сделает UPDATE при коммите
    public void introduce(String username, IntroduceRequest req) {
        User user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Не найден пользователь: " + username));

        user.setNickname(req.nickname());
        user.setFullName(req.fullName());
        user.setDateOfBirth(req.dateOfBirth());
        user.setPersonnelNumber(req.personnelNumber());
        user.setLongPersonnelNumber(req.longPersonnelNumber());
        user.setNumberOfColumn(req.numberOfColumn());

        //.:: Юзаем getReferenceById: возвращает прокси без запроса к БД.
        //::: Если обратиться к полям прокси - запрос уйдёт
        user.setPosition(positionRepository.getReferenceById(req.positionId()));
        user.setTractionKind(tractionKindRepository.getReferenceById(req.tractionKind()));
        user.setServiceType(serviceTypeRepository.getReferenceById(req.serviceTypeId()));
        user.setLocomotiveDepot(locomotiveDepotRepository.getReferenceById(req.depotId()));

        Account account = user.getAccount();
        account.setWasIntroduced(true);
    }
}
