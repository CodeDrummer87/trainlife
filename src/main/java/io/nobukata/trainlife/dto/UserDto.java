package io.nobukata.trainlife.dto;

import java.time.LocalDate;

public record UserDto(
        String nickname,
        String fullName,
        LocalDate dateOfBirth,
        String positionAbbreviate,
        Integer numberOfColumn,
        Integer personnelNumber,
        Integer longPersonnelNumber,
        String tractionKindTitle,
        String serviceTypeTitle,
        String locomotiveDepotAbbreviation,
        String railwayFullTitle,
        String railwayAbbreviation
) {}
