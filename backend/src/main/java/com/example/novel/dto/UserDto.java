package com.example.novel.dto;

import com.example.novel.entity.Role;
import java.time.LocalDate;

public record UserDto(Long id, String username, Role role, LocalDate expiryDate, String firstName, String lastName) {
}
