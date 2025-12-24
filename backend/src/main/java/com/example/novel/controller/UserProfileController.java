package com.example.novel.controller;

import com.example.novel.dto.UserDto;
import com.example.novel.dto.UserProfileUpdateDto;
import com.example.novel.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
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
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (newPassword == null || newPassword.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password cannot be empty");
        }
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password cannot be empty");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userService.changePassword(auth.getName(), currentPassword, newPassword);
    }

    @PutMapping("/info")
    public UserDto updateProfile(@RequestBody UserProfileUpdateDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.updateProfile(auth.getName(), dto);
    }
}
