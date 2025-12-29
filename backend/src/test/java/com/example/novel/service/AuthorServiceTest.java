package com.example.novel.service;

import com.example.novel.dto.AuthorRequest;
import com.example.novel.dto.AuthorResponse;
import com.example.novel.entity.Author;
import com.example.novel.repository.AuthorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.example.novel.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private AuthorService authorService;

    @Test
    void search_ShouldReturnListOfAuthors_WhenNameIsNull() {
        // Arrange
        Author author1 = new Author(1L, "Author 1", LocalDate.now(), "Japan");
        Author author2 = new Author(2L, "Author 2", LocalDate.now(), "USA");
        when(authorRepository.findAll()).thenReturn(Arrays.asList(author1, author2));

        // Act
        List<AuthorResponse> result = authorService.search(null);

        // Assert
        assertEquals(2, result.size());
        assertEquals("Author 1", result.get(0).name());
        assertEquals("Author 2", result.get(1).name());
        verify(authorRepository, times(1)).findAll();
    }

    @Test
    void search_ShouldReturnPageOfAuthors_WhenNameIsNull() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Author author = new Author(1L, "Author 1", LocalDate.now(), "Japan");
        Page<Author> authorPage = new PageImpl<>(Arrays.asList(author));
        when(authorRepository.findAll(pageable)).thenReturn(authorPage);

        // Act
        Page<AuthorResponse> result = authorService.search(null, pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Author 1", result.getContent().get(0).name());
        verify(authorRepository, times(1)).findAll(pageable);
    }

    @Test
    void search_ShouldReturnListOfMatchingAuthors_WhenNameIsProvided() {
        // Arrange
        String name = "Test";
        Author author = new Author(1L, "Test Author", LocalDate.now(), "Japan");
        when(authorRepository.findByNameContainingIgnoreCase(name)).thenReturn(Arrays.asList(author));

        // Act
        List<AuthorResponse> result = authorService.search(name);

        // Assert
        assertEquals(1, result.size());
        assertEquals("Test Author", result.get(0).name());
        verify(authorRepository, times(1)).findByNameContainingIgnoreCase(name);
    }

    @Test
    void search_ShouldReturnPageOfMatchingAuthors_WhenNameIsProvided() {
        // Arrange
        String name = "Test";
        Pageable pageable = PageRequest.of(0, 10);
        Author author = new Author(1L, "Test Author", LocalDate.now(), "Japan");
        Page<Author> authorPage = new PageImpl<>(Arrays.asList(author));
        when(authorRepository.findByNameContainingIgnoreCase(name, pageable)).thenReturn(authorPage);

        // Act
        Page<AuthorResponse> result = authorService.search(name, pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Author", result.getContent().get(0).name());
        verify(authorRepository, times(1)).findByNameContainingIgnoreCase(name, pageable);
    }

    @Test
    void create_ShouldReturnCreatedAuthor() {
        // Arrange
        AuthorRequest request = new AuthorRequest("New Author", LocalDate.parse("1990-01-01"), "Japan");
        Author savedAuthor = new Author(1L, "New Author", LocalDate.parse("1990-01-01"), "Japan");
        when(authorRepository.save(any(Author.class))).thenReturn(savedAuthor);

        // Act
        AuthorResponse result = authorService.create(request);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("New Author", result.name());
        assertEquals("Japan", result.nationality());
        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    void update_ShouldUpdateAndReturnAuthor_WhenExists() {
        // Arrange
        Long id = 1L;
        AuthorRequest request = new AuthorRequest("Updated Author", LocalDate.parse("1990-01-01"), "USA");
        Author existingAuthor = new Author(id, "Old Author", LocalDate.parse("1980-01-01"), "Japan");
        Author updatedAuthor = new Author(id, "Updated Author", LocalDate.parse("1990-01-01"), "USA");

        when(authorRepository.findById(id)).thenReturn(Optional.of(existingAuthor));
        when(authorRepository.save(any(Author.class))).thenReturn(updatedAuthor);

        // Act
        AuthorResponse result = authorService.update(id, request);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Author", result.name());
        assertEquals("USA", result.nationality());
        verify(authorRepository, times(1)).findById(id);
        verify(authorRepository, times(1)).save(existingAuthor);
    }

    @Test
    void update_ShouldThrowException_WhenAuthorNotFound() {
        // Arrange
        Long id = 99L;
        AuthorRequest request = new AuthorRequest("Updated Author", LocalDate.now(), "USA");
        when(authorRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            authorService.update(id, request);
        });
        verify(authorRepository, times(1)).findById(id);
        verify(authorRepository, never()).save(any(Author.class));
    }

    @Test
    void delete_ShouldCallRepositoryDelete() {
        // Arrange
        Long id = 1L;
        doNothing().when(authorRepository).deleteById(id);

        // Act
        authorService.delete(id);

        // Assert
        verify(authorRepository, times(1)).deleteById(id);
    }

    @Test
    void get_ShouldReturnAuthor_WhenExists() {
        // Arrange
        Long id = 1L;
        Author author = new Author(id, "Test Author", LocalDate.now(), "Japan");
        when(authorRepository.findById(id)).thenReturn(Optional.of(author));

        // Act
        AuthorResponse result = authorService.get(id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.id());
        assertEquals("Test Author", result.name());
        verify(authorRepository, times(1)).findById(id);
    }

    @Test
    void get_ShouldThrowException_WhenAuthorNotFound() {
        // Arrange
        Long id = 99L;
        when(authorRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            authorService.get(id);
        });
        verify(authorRepository, times(1)).findById(id);
    }
}
