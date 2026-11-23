package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.StationDto;
import io.nobukata.trainlife.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//.:: OSIV [spring:jpa:open-in-view = true (Default) (the session is open before ending of HTTP-request)]
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
