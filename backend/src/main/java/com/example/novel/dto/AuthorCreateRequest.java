package com.example.novel.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record AuthorCreateRequest(
        @NotBlank String name,
        LocalDate birthDate,
        String nationality) {
}
