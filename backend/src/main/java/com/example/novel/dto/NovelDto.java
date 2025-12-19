package com.example.novel.dto;

import java.time.LocalDate;

public record NovelDto(
        Long id,
        String title,
        String description,
        String authorName,
        Long authorId,
        LocalDate publishDate) {
}
