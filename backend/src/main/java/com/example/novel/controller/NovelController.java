package com.example.novel.controller;

import com.example.novel.dto.NovelCreateDto;
import com.example.novel.dto.NovelDto;
import com.example.novel.service.NovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/novels")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;

    @GetMapping
    public Page<NovelDto> search(@RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @PageableDefault(size = 10) @NonNull Pageable pageable) {
        if (title == null && author == null) {
            return novelService.getAllNovels(pageable);
        }
        return novelService.search(title, author, pageable);
    }

    @GetMapping("/{id}")
    public NovelDto getNovel(@PathVariable @NonNull Long id) {
        return novelService.getNovel(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public NovelDto createNovel(@RequestBody @Valid NovelCreateDto dto) {
        return novelService.createNovel(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public NovelDto updateNovel(@PathVariable @NonNull Long id, @RequestBody @Valid NovelCreateDto dto) {
        return novelService.updateNovel(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNovel(@PathVariable @NonNull Long id) {
        novelService.deleteNovel(id);
        return ResponseEntity.ok().build();
    }
}
