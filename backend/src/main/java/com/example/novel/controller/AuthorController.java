package com.example.novel.controller;

import com.example.novel.dto.AuthorRequest;
import com.example.novel.dto.AuthorResponse;
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

    @GetMapping("/autocomplete")
    public List<AuthorResponse> search(@RequestParam(required = false) String name) {
        if (name == null) {
            return authorService.getAll();
        }
        return authorService.searchByName(name);
    }

    @GetMapping
    public PagedModel<AuthorResponse> search(@RequestParam(required = false) String name,
            @PageableDefault(size = 10) Pageable pageable) {
        if (name == null) {
            return new PagedModel<>(authorService.getAll(pageable));
        }
        return new PagedModel<>(authorService.searchByName(name, pageable));
    }

    @GetMapping("/{id}")
    public AuthorResponse get(@PathVariable Long id) {
        return authorService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorResponse create(@RequestBody @Valid AuthorRequest dto) {
        return authorService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorResponse update(@PathVariable Long id, @RequestBody @Valid AuthorRequest dto) {
        return authorService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        authorService.delete(id);
    }
}
