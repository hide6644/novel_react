package com.example.novel.dto;

import com.example.novel.entity.Role;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(
        @NotBlank String username,
        String password,
        String firstName,
        String lastName,
        @NotNull Role role,
        LocalDate expiryDate,
        Boolean enabled) {
}
