package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.TrafficLightDto;
import io.nobukata.trainlife.service.TrafficLightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/traffic-lights")
public class TrafficLightController {

    private final TrafficLightService trafficLightService;

    public TrafficLightController(TrafficLightService trafficLightService) {
        this.trafficLightService = trafficLightService;
    }

    @GetMapping("/station/{id}")
    public ResponseEntity<List<TrafficLightDto>> getAllTrafficLightsByStationId(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.getAllTrafficLightsByStationId(id));
    }
}
