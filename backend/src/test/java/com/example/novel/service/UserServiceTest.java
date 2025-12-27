package com.example.novel.service;

import com.example.novel.dto.ChangePasswordRequest;
import com.example.novel.dto.UserCreateRequest;
import com.example.novel.dto.UserProfileUpdateRequest;
import com.example.novel.dto.UserResponse;
import com.example.novel.dto.UserUpdateRequest;
import com.example.novel.entity.Role;
import com.example.novel.entity.User;
import com.example.novel.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "passwordExpirationDays", 90);
    }

    @Test
    void getAll_ShouldReturnListOfUsers() {
        // Arrange
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        user1.setRole(Role.USER);

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setRole(Role.ADMIN);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // Act
        List<UserResponse> result = userService.getAll();

        // Assert
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void create_ShouldReturnCreatedUser_WhenUsernameDoesNotExist() {
        // Arrange
        UserCreateRequest request = new UserCreateRequest(
                "newuser", "password", "First", "Last", Role.USER, null, true);

        when(userRepository.findByUsername(request.username())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername(request.username());
        savedUser.setRole(request.role());
        savedUser.setExpiryDate(LocalDate.now().plusDays(90));
        savedUser.setEnabled(true);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse result = userService.create(request);

        // Assert
        assertNotNull(result);
        assertEquals("newuser", result.username());
        verify(userRepository, times(1)).findByUsername(request.username());
        verify(passwordEncoder, times(1)).encode(request.password());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void create_ShouldThrowException_WhenUsernameExists() {
        // Arrange
        UserCreateRequest request = new UserCreateRequest(
                "existinguser", "password", "First", "Last", Role.USER, null, true);

        when(userRepository.findByUsername(request.username())).thenReturn(Optional.of(new User()));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> userService.create(request));
        verify(userRepository, times(1)).findByUsername(request.username());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void update_ShouldUpdateUser_WhenUserExists() {
        // Arrange
        Long userId = 1L;
        UserUpdateRequest request = new UserUpdateRequest(
                "user", "newpassword", "First", "Last", Role.ADMIN, null, false);

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setUsername("user");
        existingUser.setPassword("oldpassword");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode(request.password())).thenReturn("encodedNewPassword");

        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setUsername("user");
        updatedUser.setRole(Role.ADMIN);
        updatedUser.setEnabled(false);

        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        UserResponse result = userService.update(userId, request);

        // Assert
        assertNotNull(result);
        assertEquals(Role.ADMIN, result.role());
        assertFalse(result.enabled());
        verify(userRepository, times(1)).findById(userId);
        verify(passwordEncoder, times(1)).encode(request.password());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void update_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        Long userId = 99L;
        UserUpdateRequest request = new UserUpdateRequest(
                "user", "password", "First", "Last", Role.USER, null, true);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> userService.update(userId, request));
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void delete_ShouldCallRepositoryDelete() {
        // Arrange
        Long userId = 1L;
        doNothing().when(userRepository).deleteById(userId);

        // Act
        userService.delete(userId);

        // Assert
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    void searchByUsername_ShouldReturnUser_WhenExists() {
        // Arrange
        String username = "user";
        User user = new User();
        user.setId(1L);
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        // Act
        UserResponse result = userService.searchByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.username());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void searchByUsername_ShouldThrowException_WhenNotFound() {
        // Arrange
        String username = "unknown";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> userService.searchByUsername(username));
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void changePassword_ShouldUpdatePassword_WhenCurrentPasswordIsCorrect() {
        // Arrange
        String username = "user";
        ChangePasswordRequest request = new ChangePasswordRequest("current", "new");
        User user = new User();
        user.setUsername(username);
        user.setPassword("encodedCurrent");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.currentPassword(), user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(request.newPassword())).thenReturn("encodedNew");

        // Act
        userService.changePassword(username, request);

        // Assert
        verify(userRepository, times(1)).save(user);
        verify(passwordEncoder, times(1)).encode(request.newPassword());
    }

    @Test
    void changePassword_ShouldThrowException_WhenCurrentPasswordIsIncorrect() {
        // Arrange
        String username = "user";
        ChangePasswordRequest request = new ChangePasswordRequest("wrong", "new");
        User user = new User();
        user.setUsername(username);
        user.setPassword("encodedCurrent");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.currentPassword(), user.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> userService.changePassword(username, request));
        verify(userRepository, never()).save(user);
    }

    @Test
    void updateProfile_ShouldUpdateProfile_WhenUserExists() {
        // Arrange
        String username = "user";
        UserProfileUpdateRequest request = new UserProfileUpdateRequest("NewFirst", "NewLast");
        User user = new User();
        user.setUsername(username);
        user.setFirstName("OldFirst");
        user.setLastName("OldLast");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserResponse result = userService.updateProfile(username, request);

        // Assert
        assertEquals("NewFirst", result.firstName());
        assertEquals("NewLast", result.lastName());
        verify(userRepository, times(1)).save(user);
    }
}
