package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.RailwayDto;
import io.nobukata.trainlife.service.RailwayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/railways")
public class RailwayController {

    private final RailwayService railwayService;

    public RailwayController(RailwayService railwayService) {
        this.railwayService = railwayService;
    }


    @GetMapping
    public ResponseEntity<List<RailwayDto>> getAllRailways() {
        return ResponseEntity.ok(railwayService.getAllRailwaysByIsActiveTrue());
    }
}
