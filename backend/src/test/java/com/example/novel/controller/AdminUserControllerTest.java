package com.example.novel.controller;

import com.example.novel.dto.UserCreateRequest;
import com.example.novel.dto.UserResponse;
import com.example.novel.dto.UserUpdateRequest;
import com.example.novel.entity.Role;
import com.example.novel.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
class AdminUserControllerTest {

    @MockitoBean
    private UserService userService;

    @Autowired
    private AdminUserController adminUserController;

    @Test
    void getAll_ShouldReturnListOfUsers() {
        UserResponse user = new UserResponse(1L, "user1", Role.USER, "First", "Last", LocalDate.now(), true);
        List<UserResponse> users = Arrays.asList(user);

        when(userService.getAll()).thenReturn(users);

        adminUserController.getAll();

        verify(userService).getAll();
    }

    @Test
    void create_ShouldReturnCreatedUser() {
        UserCreateRequest request = new UserCreateRequest("newuser", "pass", "First", "Last", Role.USER, null, true);
        UserResponse response = new UserResponse(1L, "newuser", Role.USER, "First", "Last", LocalDate.now(), true);

        when(userService.create(any(UserCreateRequest.class))).thenReturn(response);

        adminUserController.create(request);

        verify(userService).create(any(UserCreateRequest.class));
    }

    @Test
    void update_ShouldReturnUpdatedUser() {
        Long id = 1L;
        UserUpdateRequest request = new UserUpdateRequest("user", null, "Updated", "Last", Role.ADMIN, null, false);
        UserResponse response = new UserResponse(id, "user", Role.ADMIN, "Updated", "Last", LocalDate.now(), false);

        when(userService.update(eq(id), any(UserUpdateRequest.class))).thenReturn(response);

        adminUserController.update(id, request);

        verify(userService).update(eq(id), any(UserUpdateRequest.class));
    }

    @Test
    void delete_ShouldCallServiceDelete() {
        Long id = 1L;
        doNothing().when(userService).delete(id);

        adminUserController.delete(id);

        verify(userService).delete(id);
    }
}
