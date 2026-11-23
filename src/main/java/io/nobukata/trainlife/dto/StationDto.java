package io.nobukata.trainlife.dto;

public record StationDto(
        Long id,
        String stationTitle,
        String railwayAbbreviation,
        String code,
        Boolean hasTurnoutPoint,
        Boolean isObserved
) {}
