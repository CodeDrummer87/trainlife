package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.ServiceTypeDto;
import io.nobukata.trainlife.service.ServiceTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-types")
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    public ServiceTypeController(ServiceTypeService serviceTypeService) {
        this.serviceTypeService = serviceTypeService;
    }


    @GetMapping
    public ResponseEntity<List<ServiceTypeDto>> findAll() {
        return ResponseEntity.ok(serviceTypeService.findAll());
    }
}
