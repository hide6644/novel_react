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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.security.password-expiration-days:90}")
    private int passwordExpirationDays;

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse create(UserCreateRequest dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(dto.role());
        // Use injected value if dto doesn't strictly overriding (assuming logic:
        // typically creation follows policy)
        // However, if dto.expiryDate is provided (e.g. from Admin UI manual override),
        // we might respect it.
        // Let's fallback to policy if null.
        if (dto.expiryDate() != null) {
            user.setExpiryDate(dto.expiryDate());
        } else {
            user.setExpiryDate(java.time.LocalDate.now().plusDays(passwordExpirationDays));
        }

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    @Override
    public UserResponse update(Long id, UserUpdateRequest dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        // For update, typically we might not change username or password here, but
        // simplified:
        // If password is provided and not empty, update it.
        if (dto.password() != null && !dto.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
            user.setExpiryDate(java.time.LocalDate.now().plusDays(passwordExpirationDays));
        }
        user.setRole(dto.role());
        if (dto.expiryDate() != null) {
            user.setExpiryDate(dto.expiryDate());
        }
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse searchByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toDto(user);
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setExpiryDate(java.time.LocalDate.now().plusDays(passwordExpirationDays));
        userRepository.save(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest dto) {
        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        user.setExpiryDate(java.time.LocalDate.now().plusDays(passwordExpirationDays));
        userRepository.save(user);
    }

    @Override
    public UserResponse updateProfile(String username, UserProfileUpdateRequest dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        return toDto(userRepository.save(user));
    }

    private UserResponse toDto(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.getExpiryDate(),
                user.getFirstName(),
                user.getLastName());
    }
}
