package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.LocomotiveSeriesDto;
import io.nobukata.trainlife.repository.LocomotiveSeriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocomotiveSeriesService {

    private final LocomotiveSeriesRepository locomotiveSeriesRepository;

    public LocomotiveSeriesService(LocomotiveSeriesRepository locomotiveSeriesRepository) {
        this.locomotiveSeriesRepository = locomotiveSeriesRepository;
    }

    public List<LocomotiveSeriesDto> getAllLocomotiveSeries() {
        return locomotiveSeriesRepository.findAll().stream()
                .map(s -> new LocomotiveSeriesDto(
                        s.getId(),
                        s.getTitle(),
                        s.getLocoType().getId()
                ))
                .toList();
    }
}
