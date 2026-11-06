package io.nobukata.trainlife.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record IntroduceRequest(

        @NotBlank Long locomotiveDepotId,
        @NotBlank String position,
        @NotBlank(message = "Не указан короткий табельный номер")
        @Pattern(regexp = "\\d{3,10}", message = "Табельный номер должен содержать от 3 до 10 цифр")
        Integer personnelNumber,
        @NotBlank(message = "Не указан единый для ЕКАСУТР табельный номер")
        @Pattern(regexp = "\\d{8}", message = "Табельный номер должен содержать 8 цифр")
        Integer longPersonnelNumber,
        @NotBlank(message = "Не указан номер колонны")
        Integer numberOfColumn,
        @NotBlank String serviceType,
        @NotBlank String tractionKind,
        @NotBlank String fullName,
        @NotBlank LocalDate birthDate,
        @NotBlank(message = "Придумайте себе псевдоним")
        String nickname
        ) {
}
