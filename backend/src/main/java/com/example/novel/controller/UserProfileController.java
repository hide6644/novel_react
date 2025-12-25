package com.example.novel.controller;

import com.example.novel.dto.UserResponse;
import com.example.novel.dto.ChangePasswordRequest;
import com.example.novel.dto.UserProfileUpdateRequest;
import com.example.novel.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    @PutMapping("/password")
    public void changePassword(@RequestBody @Valid ChangePasswordRequest dto) {
        userService.changePassword(SecurityContextHolder.getContext().getAuthentication().getName(), dto);
    }

    @PutMapping("/info")
    public UserResponse updateProfile(@RequestBody UserProfileUpdateRequest dto) {
        return userService.updateProfile(SecurityContextHolder.getContext().getAuthentication().getName(), dto);
    }
}
