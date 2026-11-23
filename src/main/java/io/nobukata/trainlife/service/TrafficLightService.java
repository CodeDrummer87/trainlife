package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.TrafficLightDto;
import io.nobukata.trainlife.repository.TrafficLightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrafficLightService {

    private final TrafficLightRepository trafficLightRepository;

    public TrafficLightService(TrafficLightRepository trafficLightRepository) {
        this.trafficLightRepository = trafficLightRepository;
    }


    public List<TrafficLightDto> getAllTrafficLightsByStationId(long stationId) {
        return trafficLightRepository.findAllByStationId(stationId).stream()
                .map(t -> new TrafficLightDto(
                        t.getId(),
                        t.getIsEvenDirection(),
                        t.getTitle(),
                        t.getStation().getId()
                ))
                .toList();
    }
}
