package com.example.novel.controller;

import com.example.novel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    @PutMapping("/password")
    public void changePassword(@RequestBody Map<String, String> payload) {
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("password");

        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new IllegalArgumentException("Old password cannot be empty");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userService.changePassword(auth.getName(), oldPassword, newPassword);
    }

    @PutMapping("/info")
    public com.example.novel.dto.UserDto updateProfile(@RequestBody com.example.novel.dto.UserProfileUpdateDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.updateProfile(auth.getName(), dto);
    }
}
