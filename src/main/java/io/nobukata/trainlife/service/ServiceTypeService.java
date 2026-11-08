package io.nobukata.trainlife.service;

import io.nobukata.trainlife.dto.ServiceTypeDto;
import io.nobukata.trainlife.repository.ServiceTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;

    public ServiceTypeService(ServiceTypeRepository serviceTypeRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
    }


    public List<ServiceTypeDto> getAllServiceTypes () {
        return serviceTypeRepository.findAll().stream()
                .map(s -> new ServiceTypeDto(
                    s.getId(),
                    s.getTitle()
                )).toList();
    }
}
