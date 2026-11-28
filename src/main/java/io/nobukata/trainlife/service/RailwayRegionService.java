package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.RailwayRegionDto;
import io.nobukata.trainlife.repository.RailwayRegionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class RailwayRegionService {

    private final RailwayRegionRepository railwayRegionRepository;

    public RailwayRegionService(RailwayRegionRepository railwayRegionRepository) {
        this.railwayRegionRepository = railwayRegionRepository;
    }


    public List<RailwayRegionDto> getAllRailwayRegions() {
        return railwayRegionRepository.findAll().stream()
                .map(r -> new RailwayRegionDto(
                        r.getId(),
                        r.getRailway().getId(),
                        r.getTitle()
                ))
                .toList();
    }
}
