package com.example.novel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AuthorRequest(
        @NotBlank @Size(max = 100) String name,
        LocalDate birthDate,
        @Size(max = 100) String nationality) {
}
