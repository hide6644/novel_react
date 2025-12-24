package com.example.novel.service;

import com.example.novel.dto.NovelCreateRequest;
import com.example.novel.dto.NovelResponse;
import com.example.novel.entity.Author;
import com.example.novel.entity.Novel;
import com.example.novel.repository.AuthorRepository;
import com.example.novel.repository.NovelRepository;
import java.util.Objects;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class NovelService {

    private final NovelRepository novelRepository;
    private final AuthorRepository authorRepository;

    public Page<NovelResponse> getAll(Pageable pageable) {
        return novelRepository.findAll(pageable)
                .map(this::toDto);
    }

    public Page<NovelResponse> searchByTitleAndAuthorName(String title, String authorName, Pageable pageable) {
        return novelRepository.searchByTitleAndAuthorName(title, authorName, pageable)
                .map(this::toDto);
    }

    public NovelResponse create(NovelCreateRequest dto) {
        Long authorId = Objects.requireNonNull(dto.authorId(), "Author ID must not be null");
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        Novel novel = new Novel();
        novel.setTitle(dto.title());
        novel.setDescription(dto.description());
        novel.setPublishDate(dto.publishDate());
        novel.setAuthor(author);

        return toDto(novelRepository.save(novel));
    }

    public NovelResponse update(Long id, NovelCreateRequest dto) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Novel not found"));

        Long authorId = Objects.requireNonNull(dto.authorId(), "Author ID must not be null");
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        novel.setTitle(dto.title());
        novel.setDescription(dto.description());
        novel.setPublishDate(dto.publishDate());
        novel.setAuthor(author);

        return toDto(novelRepository.save(novel));
    }

    public void delete(Long id) {
        novelRepository.deleteById(id);
    }

    public NovelResponse get(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Novel not found"));
        return toDto(novel);
    }

    private NovelResponse toDto(Novel novel) {
        return new NovelResponse(
                novel.getId(),
                novel.getTitle(),
                novel.getDescription(),
                novel.getAuthor().getName(),
                novel.getAuthor().getId(),
                novel.getPublishDate());
    }
}
