package com.example.novel.service;

import com.example.novel.dto.NovelRequest;
import com.example.novel.dto.NovelResponse;
import com.example.novel.entity.Author;
import com.example.novel.entity.Novel;
import com.example.novel.repository.AuthorRepository;
import com.example.novel.repository.NovelRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NovelServiceTest {

    @Mock
    private NovelRepository novelRepository;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private NovelService novelService;

    @Test
    void getAll_ShouldReturnPageOfNovels() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Author author = new Author(1L, "Author", LocalDate.now(), "Country");
        Novel novel = new Novel(1L, "Title", "Description", LocalDate.now(), author, null);
        Page<Novel> novelPage = new PageImpl<>(Arrays.asList(novel));

        when(novelRepository.findAll(pageable)).thenReturn(novelPage);

        // Act
        Page<NovelResponse> result = novelService.getAll(pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Title", result.getContent().get(0).title());
        verify(novelRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchByTitleAndAuthorName_ShouldReturnPageOfMatchingNovels() {
        // Arrange
        String title = "Title";
        String authorName = "Author";
        Pageable pageable = PageRequest.of(0, 10);
        Author author = new Author(1L, "Author", LocalDate.now(), "Country");
        Novel novel = new Novel(1L, "Title", "Description", LocalDate.now(), author, null);
        Page<Novel> novelPage = new PageImpl<>(Arrays.asList(novel));

        when(novelRepository.searchByTitleAndAuthorName(title, authorName, pageable)).thenReturn(novelPage);

        // Act
        Page<NovelResponse> result = novelService.searchByTitleAndAuthorName(title, authorName, pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Title", result.getContent().get(0).title());
        verify(novelRepository, times(1)).searchByTitleAndAuthorName(title, authorName, pageable);
    }

    @Test
    void create_ShouldReturnCreatedNovel_WhenAuthorExists() {
        // Arrange
        Long authorId = 1L;
        NovelRequest request = new NovelRequest("Title", "Description", authorId, LocalDate.now());
        Author author = new Author(authorId, "Author", LocalDate.now(), "Country");
        Novel savedNovel = new Novel(1L, "Title", "Description", LocalDate.now(), author, null);

        when(authorRepository.findById(authorId)).thenReturn(Optional.of(author));
        when(novelRepository.save(any(Novel.class))).thenReturn(savedNovel);

        // Act
        NovelResponse result = novelService.create(request);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("Title", result.title());
        assertEquals("Author", result.authorName());
        verify(authorRepository, times(1)).findById(authorId);
        verify(novelRepository, times(1)).save(any(Novel.class));
    }

    @Test
    void create_ShouldThrowException_WhenAuthorNotFound() {
        // Arrange
        Long authorId = 99L;
        NovelRequest request = new NovelRequest("Title", "Description", authorId, LocalDate.now());

        when(authorRepository.findById(authorId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            novelService.create(request);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Author not found", exception.getReason());
        verify(authorRepository, times(1)).findById(authorId);
        verify(novelRepository, never()).save(any(Novel.class));
    }

    @Test
    void update_ShouldUpdateAndReturnNovel_WhenNovelAndAuthorExist() {
        // Arrange
        Long novelId = 1L;
        Long authorId = 1L;
        NovelRequest request = new NovelRequest("Updated Title", "Updated Description", authorId, LocalDate.now());

        Author author = new Author(authorId, "Author", LocalDate.now(), "Country");
        Novel existingNovel = new Novel(novelId, "Old Title", "Old Description", LocalDate.now(), author, null);
        Novel updatedNovel = new Novel(novelId, "Updated Title", "Updated Description", LocalDate.now(), author, null);

        when(novelRepository.findById(novelId)).thenReturn(Optional.of(existingNovel));
        when(authorRepository.findById(authorId)).thenReturn(Optional.of(author));
        when(novelRepository.save(any(Novel.class))).thenReturn(updatedNovel);

        // Act
        NovelResponse result = novelService.update(novelId, request);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Title", result.title());
        assertEquals("Updated Description", result.description());
        verify(novelRepository, times(1)).findById(novelId);
        verify(authorRepository, times(1)).findById(authorId);
        verify(novelRepository, times(1)).save(existingNovel);
    }

    @Test
    void update_ShouldThrowException_WhenNovelNotFound() {
        // Arrange
        Long novelId = 99L;
        NovelRequest request = new NovelRequest("Title", "Description", 1L, LocalDate.now());

        when(novelRepository.findById(novelId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            novelService.update(novelId, request);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Novel not found", exception.getReason());
        verify(novelRepository, times(1)).findById(novelId);
        verify(novelRepository, never()).save(any(Novel.class));
    }

    @Test
    void update_ShouldThrowException_WhenAuthorNotFound() {
        // Arrange
        Long novelId = 1L;
        Long authorId = 99L;
        NovelRequest request = new NovelRequest("Title", "Description", authorId, LocalDate.now());
        Author existingAuthor = new Author(1L, "Author", LocalDate.now(), "Country");
        Novel existingNovel = new Novel(novelId, "Title", "Description", LocalDate.now(), existingAuthor, null);

        when(novelRepository.findById(novelId)).thenReturn(Optional.of(existingNovel));
        when(authorRepository.findById(authorId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            novelService.update(novelId, request);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Author not found", exception.getReason());
        verify(novelRepository, times(1)).findById(novelId);
        verify(authorRepository, times(1)).findById(authorId);
        verify(novelRepository, never()).save(any(Novel.class));
    }

    @Test
    void delete_ShouldCallRepositoryDelete() {
        // Arrange
        Long novelId = 1L;
        doNothing().when(novelRepository).deleteById(novelId);

        // Act
        novelService.delete(novelId);

        // Assert
        verify(novelRepository, times(1)).deleteById(novelId);
    }

    @Test
    void get_ShouldReturnNovel_WhenExists() {
        // Arrange
        Long novelId = 1L;
        Author author = new Author(1L, "Author", LocalDate.now(), "Country");
        Novel novel = new Novel(novelId, "Title", "Description", LocalDate.now(), author, null);

        when(novelRepository.findById(novelId)).thenReturn(Optional.of(novel));

        // Act
        NovelResponse result = novelService.get(novelId);

        // Assert
        assertNotNull(result);
        assertEquals(novelId, result.id());
        assertEquals("Title", result.title());
        verify(novelRepository, times(1)).findById(novelId);
    }

    @Test
    void get_ShouldThrowException_WhenNovelNotFound() {
        // Arrange
        Long novelId = 99L;
        when(novelRepository.findById(novelId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            novelService.get(novelId);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Novel not found", exception.getReason());
        verify(novelRepository, times(1)).findById(novelId);
    }
}
