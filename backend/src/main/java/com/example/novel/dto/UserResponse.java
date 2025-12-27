package com.example.novel.dto;

import com.example.novel.entity.Role;
import java.time.LocalDate;

public record UserResponse(
        Long id, String username, Role role, String firstName, String lastName, LocalDate expiryDate,
        boolean enabled) {
}
