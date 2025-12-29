package com.example.novel.service;

import com.example.novel.dto.ChangePasswordRequest;
import com.example.novel.dto.UserCreateRequest;
import com.example.novel.dto.UserProfileUpdateRequest;
import com.example.novel.dto.UserResponse;
import com.example.novel.dto.UserUpdateRequest;
import com.example.novel.entity.User;
import com.example.novel.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.password-expiration-days:90}")
    private int passwordExpirationDays;

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserResponse create(UserCreateRequest dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(dto.role());

        if (dto.expiryDate() != null) {
            user.setExpiryDate(dto.expiryDate());
        } else {
            user.setExpiryDate(LocalDate.now().plusDays(passwordExpirationDays));
        }

        if (dto.enabled() != null) {
            user.setEnabled(dto.enabled());
        }

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    public UserResponse update(Long id, UserUpdateRequest dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (dto.password() != null && !dto.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
            user.setExpiryDate(LocalDate.now().plusDays(passwordExpirationDays));
        }

        user.setRole(dto.role());

        if (dto.expiryDate() != null) {
            user.setExpiryDate(dto.expiryDate());
        }

        if (dto.enabled() != null) {
            user.setEnabled(dto.enabled());
        }

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public UserResponse searchByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toDto(user);
    }

    public void changePassword(String username, ChangePasswordRequest dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        user.setExpiryDate(LocalDate.now().plusDays(passwordExpirationDays));
        userRepository.save(user);
    }

    public UserResponse updateProfile(String username, UserProfileUpdateRequest dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    private UserResponse toDto(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getExpiryDate(),
                user.isEnabled());
    }
}
