package com.example.novel.dto;

import com.example.novel.entity.Role;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank @Size(max = 100) String username,
        @NotBlank @Size(max = 100) String password,
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @NotNull Role role,
        LocalDate expiryDate,
        Boolean enabled) {
}
