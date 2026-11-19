package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.LocomotiveTypeDto;
import io.nobukata.trainlife.service.LocomotiveTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locomotive-types")
public class LocomotiveTypeController {

    private final LocomotiveTypeService locomotiveTypeService;

    public LocomotiveTypeController(LocomotiveTypeService locomotiveTypeService) {
        this.locomotiveTypeService = locomotiveTypeService;
    }


    @GetMapping
    public ResponseEntity<List<LocomotiveTypeDto>> getAllLocomotiveTypes() {
        return ResponseEntity.ok(locomotiveTypeService.getAllLocomotiveTypes());
    }
}
