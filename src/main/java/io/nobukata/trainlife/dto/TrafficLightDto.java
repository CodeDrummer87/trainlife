package io.nobukata.trainlife.dto;

public record TrafficLightDto(
        Long id,
        Boolean isEvenDirection,
        String title,
        Long stationId
){}
