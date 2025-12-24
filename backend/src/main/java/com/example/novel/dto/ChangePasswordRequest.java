package com.example.novel.dto;

public record ChangePasswordRequest(
                String username,
                String currentPassword,
                String newPassword) {
}
