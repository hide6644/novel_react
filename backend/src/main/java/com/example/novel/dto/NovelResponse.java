package com.example.novel.dto;

import java.time.LocalDate;

public record NovelResponse(
        Long id,
        String title,
        String description,
        String authorName,
        Long authorId,
        LocalDate publishDate) {
}
