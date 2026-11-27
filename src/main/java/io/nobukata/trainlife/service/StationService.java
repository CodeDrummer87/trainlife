package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.StationDto;
import io.nobukata.trainlife.repository.StationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<StationDto> getStationsByHasTurnoutPointIsTrue(long id) {
        return stationRepository.findALLByRailwayRegionIdAndHasTurnoutPointIsTrueOrderByTitleAsc(id).stream()
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

    public List<StationDto> getAllStationsByRailwayId(long id) {
        return stationRepository.findAllByRailwayIdOrderByTitleAsc(id).stream()
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
