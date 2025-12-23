package com.example.novel.config;

import com.example.novel.entity.Role;
import com.example.novel.entity.User;
import com.example.novel.repository.AuthorRepository;
import com.example.novel.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;
import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataSource dataSource;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                // Admin User
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                admin.setExpiryDate(LocalDate.now().plusYears(100)); // Never expire basically
                admin.setFirstName("Admin");
                admin.setLastName("User");
                userRepository.save(admin);

                // Normal User
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("user"));
                user.setRole(Role.USER);
                user.setExpiryDate(LocalDate.now().plusDays(30));
                user.setFirstName("Normal");
                user.setLastName("User");
                userRepository.save(user);

                // Expired User
                User expired = new User();
                expired.setUsername("expired");
                expired.setPassword(passwordEncoder.encode("password"));
                expired.setRole(Role.USER);
                expired.setExpiryDate(LocalDate.now().minusDays(1)); // Expired yesterday
                userRepository.save(expired);
            }

            if (authorRepository.count() == 0) {
                // Initialize Authors and Novels from SQL
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.addScript(new ClassPathResource("import_data.sql"));
                populator.execute(dataSource);
            }
        };
    }
}
