package com.example.novel.controller;

import com.example.novel.dto.NovelCreateRequest;
import com.example.novel.dto.NovelResponse;
import com.example.novel.service.NovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/novels")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;

    @GetMapping
    public PagedModel<NovelResponse> search(@RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @PageableDefault(size = 10) Pageable pageable) {
        if (title == null && author == null) {
            return new PagedModel<>(novelService.getAll(pageable));
        }
        return new PagedModel<>(novelService.searchByTitleAndAuthorName(title, author, pageable));
    }

    @GetMapping("/{id}")
    public NovelResponse get(@PathVariable Long id) {
        return novelService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public NovelResponse create(@RequestBody @Valid NovelCreateRequest dto) {
        return novelService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public NovelResponse update(@PathVariable Long id, @RequestBody @Valid NovelCreateRequest dto) {
        return novelService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        novelService.delete(id);
        return ResponseEntity.ok().build();
    }
}
