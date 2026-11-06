package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.RailwayDto;
import io.nobukata.trainlife.repository.RailwayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RailwayService {

    private final RailwayRepository railwayRepository;

    public RailwayService(RailwayRepository railwayRepository) {
        this.railwayRepository = railwayRepository;
    }

    public List<RailwayDto> findAllRailways() {
        return railwayRepository.findAll().stream()
                .map(r -> new RailwayDto(
                        r.getId(),
                        r.getFullTitle(),
                        r.getAbbreviation(),
                        r.getCode()))
                .toList();
    }
}
