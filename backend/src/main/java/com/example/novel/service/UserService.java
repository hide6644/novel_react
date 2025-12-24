package com.example.novel.service;

import com.example.novel.dto.UserCreateRequest;
import com.example.novel.dto.UserResponse;
import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse createUser(UserCreateRequest dto);

    UserResponse updateUser(Long id, UserCreateRequest dto);

    void deleteUser(Long id);

    UserResponse getCurrentUser(String username);

    void changePassword(String username, String oldPassword, String newPassword);

    void processPasswordChange(com.example.novel.dto.ChangePasswordRequest request);

    UserResponse updateProfile(String username, com.example.novel.dto.UserProfileUpdateRequest dto);
}
