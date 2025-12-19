package com.example.novel.dto;

public record ChangePasswordRequest(
        String username,
        String oldPassword,
        String newPassword) {
}
