package com.example.novel.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NovelRequest(
        @NotBlank @Size(max = 100) String title,
        @Size(max = 1000) String description,
        @NotNull Long authorId,
        LocalDate publishDate,
        Integer version) {
}
