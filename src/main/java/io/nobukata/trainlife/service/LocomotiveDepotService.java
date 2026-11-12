package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.LocomotiveDepotAbbreviateDto;
import io.nobukata.trainlife.repository.LocomotiveDepotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocomotiveDepotService {

    private final LocomotiveDepotRepository locomotiveDepotRepository;

    public LocomotiveDepotService(LocomotiveDepotRepository locomotiveDepotRepository) {
        this.locomotiveDepotRepository = locomotiveDepotRepository;
    }


    public List<LocomotiveDepotAbbreviateDto> getAllDepotsByRailwayIdAndIsActiveTrue(Long railwayId) {
        return locomotiveDepotRepository.findByRailwayIdAndIsActiveTrue(railwayId).stream()
                .map(d -> new LocomotiveDepotAbbreviateDto(
                        d.getId(),
                        d.getShortTitle()
                ))
                .toList();
    }
}
