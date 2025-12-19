package com.example.novel.service;

import com.example.novel.dto.NovelCreateDto;
import com.example.novel.dto.NovelDto;
import com.example.novel.entity.Author;
import com.example.novel.entity.Novel;
import com.example.novel.repository.AuthorRepository;
import com.example.novel.repository.NovelRepository;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NovelService {

    private final NovelRepository novelRepository;
    private final AuthorRepository authorRepository;

    public Page<NovelDto> search(String title, String authorName, Pageable pageable) {
        return novelRepository.search(title, authorName, pageable)
                .map(this::toDto);
    }

    public Page<NovelDto> getAllNovels(@NonNull Pageable pageable) {
        return novelRepository.findAll(pageable)
                .map(this::toDto);
    }

    public NovelDto createNovel(NovelCreateDto dto) {
        Long authorId = Objects.requireNonNull(dto.authorId(), "Author ID must not be null");
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        Novel novel = new Novel();
        novel.setTitle(dto.title());
        novel.setDescription(dto.description());
        novel.setPublishDate(dto.publishDate());
        novel.setAuthor(author);

        return toDto(novelRepository.save(novel));
    }

    public NovelDto updateNovel(@NonNull Long id, NovelCreateDto dto) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        Long authorId = Objects.requireNonNull(dto.authorId(), "Author ID must not be null");
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        novel.setTitle(dto.title());
        novel.setDescription(dto.description());
        novel.setPublishDate(dto.publishDate());
        novel.setAuthor(author);

        return toDto(novelRepository.save(novel));
    }

    public void deleteNovel(@NonNull Long id) {
        novelRepository.deleteById(id);
    }

    public NovelDto getNovel(@NonNull Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Novel not found"));
        return toDto(novel);
    }

    private NovelDto toDto(Novel novel) {
        return new NovelDto(
                novel.getId(),
                novel.getTitle(),
                novel.getDescription(),
                novel.getAuthor().getName(),
                novel.getAuthor().getId(),
                novel.getPublishDate());
    }
}
