package com.example.novel.service;

import com.example.novel.dto.AuthorCreateRequest;
import com.example.novel.dto.AuthorResponse;
import com.example.novel.entity.Author;
import com.example.novel.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public List<AuthorResponse> getAll() {
        return authorRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<AuthorResponse> getAll(Pageable pageable) {
        return authorRepository.findAll(pageable)
                .map(this::toDto);
    }

    public List<AuthorResponse> searchByName(String name) {
        return authorRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<AuthorResponse> searchByName(String name, Pageable pageable) {
        return authorRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(this::toDto);
    }

    public AuthorResponse create(AuthorCreateRequest dto) {
        Author author = new Author();
        author.setName(dto.name());
        author.setBirthDate(dto.birthDate());
        author.setNationality(dto.nationality());
        return toDto(authorRepository.save(author));
    }

    public AuthorResponse update(Long id, AuthorCreateRequest dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));
        author.setName(dto.name());
        author.setBirthDate(dto.birthDate());
        author.setNationality(dto.nationality());
        return toDto(authorRepository.save(author));
    }

    public void delete(Long id) {
        authorRepository.deleteById(id);
    }

    public AuthorResponse get(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));
        return toDto(author);
    }

    private AuthorResponse toDto(Author author) {
        return new AuthorResponse(author.getId(), author.getName(), author.getBirthDate(), author.getNationality());
    }
}
