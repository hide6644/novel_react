package com.example.novel.service;

import com.example.novel.dto.AuthorCreateDto;
import com.example.novel.dto.AuthorDto;
import com.example.novel.entity.Author;
import com.example.novel.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(a -> new AuthorDto(a.getId(), a.getName(), a.getBirthDate(), a.getNationality()))
                .collect(Collectors.toList());
    }

    public List<AuthorDto> searchAuthors(String name) {
        return authorRepository.findByNameContainingIgnoreCase(name).stream()
                .map(a -> new AuthorDto(a.getId(), a.getName(), a.getBirthDate(), a.getNationality()))
                .collect(Collectors.toList());
    }

    public Page<AuthorDto> getAllAuthors(@NonNull Pageable pageable) {
        return authorRepository.findAll(pageable)
                .map(a -> new AuthorDto(a.getId(), a.getName(), a.getBirthDate(), a.getNationality()));
    }

    public AuthorDto createAuthor(AuthorCreateDto dto) {
        Author author = new Author();
        author.setName(dto.name());
        author.setBirthDate(dto.birthDate());
        author.setNationality(dto.nationality());
        return toDto(authorRepository.save(author));
    }

    public AuthorDto updateAuthor(@NonNull Long id, AuthorCreateDto dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        author.setName(dto.name());
        author.setBirthDate(dto.birthDate());
        author.setNationality(dto.nationality());
        return toDto(authorRepository.save(author));
    }

    public void deleteAuthor(@NonNull Long id) {
        authorRepository.deleteById(id);
    }

    public AuthorDto getAuthor(@NonNull Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return toDto(author);
    }

    private AuthorDto toDto(Author author) {
        return new AuthorDto(author.getId(), author.getName(), author.getBirthDate(), author.getNationality());
    }
}
