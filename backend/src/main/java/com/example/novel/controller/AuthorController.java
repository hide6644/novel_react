package com.example.novel.controller;

import com.example.novel.dto.AuthorCreateDto;
import com.example.novel.dto.AuthorDto;
import com.example.novel.service.AuthorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping
    public List<AuthorDto> getAllAuthors(@RequestParam(required = false) String name) {
        if (name != null) {
            return authorService.searchAuthors(name);
        }
        return authorService.getAllAuthors();
    }

    @GetMapping("/page")
    public PagedModel<AuthorDto> getAuthorsPaginated(@PageableDefault(size = 10) Pageable pageable) {
        return new PagedModel<>(authorService.getAllAuthors(pageable));
    }

    @GetMapping("/{id}")
    public AuthorDto getAuthor(@PathVariable Long id) {
        return authorService.getAuthor(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorDto createAuthor(@RequestBody @Valid AuthorCreateDto dto) {
        return authorService.createAuthor(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorDto updateAuthor(@PathVariable Long id, @RequestBody @Valid AuthorCreateDto dto) {
        return authorService.updateAuthor(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
    }
}
