package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.StationDto;
import io.nobukata.trainlife.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<StationDto> getStationsByHasTurnoutPointIsTrue() {
        return stationRepository.findAllByHasTurnoutPointIsTrue().stream()
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
