package com.example.novel.service;

import com.example.novel.dto.UserCreateDto;
import com.example.novel.dto.UserDto;
import java.util.List;

import org.springframework.lang.NonNull;

public interface UserService {
    List<UserDto> getAllUsers();

    UserDto createUser(UserCreateDto dto);

    UserDto updateUser(@NonNull Long id, UserCreateDto dto);

    void deleteUser(@NonNull Long id);

    UserDto getCurrentUser(String username);

    void changePassword(String username, String oldPassword, String newPassword);

    void processPasswordChange(com.example.novel.dto.ChangePasswordRequest request);

    UserDto updateProfile(String username, com.example.novel.dto.UserProfileUpdateDto dto);
}
