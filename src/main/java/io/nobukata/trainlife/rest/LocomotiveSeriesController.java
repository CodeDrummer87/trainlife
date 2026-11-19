package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.LocomotiveSeriesDto;
import io.nobukata.trainlife.service.LocomotiveSeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locomotive-series")
public class LocomotiveSeriesController {

    private final LocomotiveSeriesService locomotiveSeriesService;

    public LocomotiveSeriesController(LocomotiveSeriesService locomotiveSeriesService) {
        this.locomotiveSeriesService = locomotiveSeriesService;
    }


    @GetMapping
    public ResponseEntity<List<LocomotiveSeriesDto>> getLocomotiveSeries() {
        return ResponseEntity.ok(locomotiveSeriesService.getAllLocomotiveSeries());
    }
}
