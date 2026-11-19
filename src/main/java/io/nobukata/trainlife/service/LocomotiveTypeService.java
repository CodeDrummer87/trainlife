package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.LocomotiveTypeDto;
import io.nobukata.trainlife.repository.LocomotiveTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocomotiveTypeService {

    private final LocomotiveTypeRepository locomotiveTypeRepository;

    public LocomotiveTypeService(LocomotiveTypeRepository locomotiveTypeRepository) {
        this.locomotiveTypeRepository = locomotiveTypeRepository;
    }


    public List<LocomotiveTypeDto> getAllLocomotiveTypes() {
        return locomotiveTypeRepository.findAll().stream()
                .map(t -> new LocomotiveTypeDto(
                        t.getId(),
                        t.getTitle()
                )).toList();
    }
}
