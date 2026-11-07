package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.LocomotiveDepotAbbreviateDto;
import io.nobukata.trainlife.service.LocomotiveDepotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locomotive-depots")
public class LocomotiveDepotController {

    private final LocomotiveDepotService locomotiveDepotService;

    public LocomotiveDepotController(LocomotiveDepotService locomotiveDepotService) {
        this.locomotiveDepotService = locomotiveDepotService;
    }


    @GetMapping("/by-railway/{id}")
    public ResponseEntity<List<LocomotiveDepotAbbreviateDto>> findAllByRailwayId(@PathVariable Long id) {
        return ResponseEntity.ok(locomotiveDepotService.findAllByRailwayId(id));
    }
}
