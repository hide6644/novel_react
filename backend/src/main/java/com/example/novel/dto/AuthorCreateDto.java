package com.example.novel.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record AuthorCreateDto(
        @NotBlank(message = "Name is required") String name,
        LocalDate birthDate,
        String nationality) {
}
