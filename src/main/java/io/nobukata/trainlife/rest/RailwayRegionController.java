package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.RailwayRegionDto;
import io.nobukata.trainlife.service.RailwayRegionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/railway-regions")
public class RailwayRegionController {

    private final RailwayRegionService railwayRegionService;

    public RailwayRegionController(RailwayRegionService railwayRegionService) {
        this.railwayRegionService = railwayRegionService;
    }


    @GetMapping
    public ResponseEntity<List<RailwayRegionDto>> findAll() {
        return ResponseEntity.ok(railwayRegionService.getAllRailwayRegions());
    }
}
