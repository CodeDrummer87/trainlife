package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.PositionDto;
import io.nobukata.trainlife.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }


    public List<PositionDto> findAll() {
        return positionRepository.findAll().stream()
                .map(p -> new PositionDto(
                        p.getId(),
                        p.getTitle()
                ))
                .toList();
    }
}
