package com.example.novel.dto;

import java.time.LocalDate;

public record AuthorDto(Long id, String name, LocalDate birthDate, String nationality) {
}
