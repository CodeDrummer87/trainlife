package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.StationDto;
import io.nobukata.trainlife.service.StationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/with-turnout-point")
    public ResponseEntity<List<StationDto>> getStationsWithTurnoutPoint() {
        return ResponseEntity.ok(stationService.getStationsByHasTurnoutPointIsTrue());
    }

    @GetMapping("/railway/{id}")
    public ResponseEntity<List<StationDto>> getStationsByRailwayId(@PathVariable Long id) {
        return ResponseEntity.ok(stationService.getAllStationsByRailwayId(id));
    }
}
