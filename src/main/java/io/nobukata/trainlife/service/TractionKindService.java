package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.TractionKindDto;
import io.nobukata.trainlife.repository.TractionKindRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TractionKindService {

    private final TractionKindRepository tractionKindRepository;

    public TractionKindService(TractionKindRepository tractionKindRepository) {
        this.tractionKindRepository = tractionKindRepository;
    }


    public List<TractionKindDto> getAllTractionKinds() {
        return tractionKindRepository.findAll().stream()
                .map(t -> new TractionKindDto(
                  t.getId(),
                  t.getTitle()
                )).toList();
    }
}
