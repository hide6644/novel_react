package com.example.novel.dto;

import java.time.LocalDate;

public record AuthorResponse(Long id, String name, LocalDate birthDate, String nationality) {
}
