package io.nobukata.trainlife.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record IntroduceRequest(

        @NotNull Long depotId,
        @NotNull Long positionId,
        @NotNull Integer personnelNumber,
        @NotNull Integer longPersonnelNumber,
        @NotNull Integer numberOfColumn,
        @NotNull Long serviceTypeId,
        @NotNull Long tractionKind,
        @NotBlank String fullName,
        @NotNull LocalDate dateOfBirth,
        @NotBlank(message = "Придумайте себе псевдоним")
        String nickname
) {}
