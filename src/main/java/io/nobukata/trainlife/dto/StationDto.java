package io.nobukata.trainlife.dto;

public record StationDto(
        Long id,
        String stationTitle,
        String stationAbbreviation,
        String code,
        Boolean hasTurnoutPoint,
        Boolean isObserved
) {}
