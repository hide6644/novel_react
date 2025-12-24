package com.example.novel.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NovelCreateRequest(
        @NotBlank String title,
        String description,
        @NotNull Long authorId,
        LocalDate publishDate) {
}
