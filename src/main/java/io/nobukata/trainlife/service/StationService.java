package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.StationDto;
import io.nobukata.trainlife.repository.StationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<StationDto> getStationsByHasTurnoutPointIsTrue(Long railwayId) {
        return stationRepository.findALLByRailwayIdAndHasTurnoutPointIsTrueOrderByTitleAsc(railwayId).stream()
                .map(s -> new StationDto(
                        s.getId(),
                        s.getTitle(),
                        s.getRailway().getAbbreviation(),
                        s.getCode(),
                        s.getHasTurnoutPoint(),
                        s.getIsObserved()
                ))
                .toList();
    }

    public List<StationDto> getAllStationsByRailwayId(Long railwayId) {
        return stationRepository.findAllByRailwayIdOrderByTitleAsc(railwayId).stream()
                .map(s -> new StationDto(
                        s.getId(),
                        s.getTitle(),
                        s.getRailway().getAbbreviation(),
                        s.getCode(),
                        s.getHasTurnoutPoint(),
                        s.getIsObserved()
                ))
                .toList();
    }
}
