package com.example.novel.controller;

import com.example.novel.dto.ChangePasswordRequest;
import com.example.novel.dto.UserProfileUpdateRequest;
import com.example.novel.dto.UserResponse;
import com.example.novel.entity.Role;
import com.example.novel.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserProfileControllerTest {

    @MockitoBean
    private UserService userService;

    @Autowired
    private UserProfileController userProfileController;

    @Test
    @WithMockUser(username = "testuser")
    void changePassword_ShouldCallService() {
        ChangePasswordRequest request = new ChangePasswordRequest("oldPass", "newPass");

        doNothing().when(userService).changePassword(eq("testuser"), any(ChangePasswordRequest.class));

        userProfileController.changePassword(request);

        verify(userService).changePassword(eq("testuser"), any(ChangePasswordRequest.class));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateProfile_ShouldReturnUpdatedProfile() {
        UserProfileUpdateRequest request = new UserProfileUpdateRequest("First", "Last");
        UserResponse response = new UserResponse(1L, "testuser", Role.USER, "First", "Last", LocalDate.now(), true);

        when(userService.updateProfile(eq("testuser"), any(UserProfileUpdateRequest.class))).thenReturn(response);

        userProfileController.updateProfile(request);

        verify(userService).updateProfile(eq("testuser"), any(UserProfileUpdateRequest.class));
    }
}
