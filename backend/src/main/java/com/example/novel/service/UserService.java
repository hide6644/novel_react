package com.example.novel.service;

import com.example.novel.dto.ChangePasswordRequest;
import com.example.novel.dto.UserCreateRequest;
import com.example.novel.dto.UserProfileUpdateRequest;
import com.example.novel.dto.UserResponse;
import com.example.novel.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    List<UserResponse> getAll();

    UserResponse create(UserCreateRequest dto);

    UserResponse update(Long id, UserUpdateRequest dto);

    void delete(Long id);

    UserResponse searchByUsername(String username);

    void changePassword(String username, ChangePasswordRequest dto);

    UserResponse updateProfile(String username, UserProfileUpdateRequest dto);
}
