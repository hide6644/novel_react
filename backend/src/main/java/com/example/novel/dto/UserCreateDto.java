package com.example.novel.dto;

import com.example.novel.entity.Role;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserCreateDto(
        @NotBlank String username,
        @NotBlank String password,
        @NotNull Role role,
        LocalDate expiryDate,
        String firstName,
        String lastName) {
}
