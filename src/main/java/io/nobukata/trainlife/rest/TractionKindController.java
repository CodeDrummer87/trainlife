package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.dto.TractionKindDto;
import io.nobukata.trainlife.service.TractionKindService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/traction-kinds")
public class TractionKindController {

    private final TractionKindService tractionKindService;

    public TractionKindController(final TractionKindService tractionKindService) {
        this.tractionKindService = tractionKindService;
    }


    @GetMapping
    public ResponseEntity<List<TractionKindDto>> getTractionKinds() {
        return ResponseEntity.ok(tractionKindService.getAllTractionKinds());
    }
}
