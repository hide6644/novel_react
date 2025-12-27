package com.example.novel.controller;

import com.example.novel.dto.AuthorRequest;
import com.example.novel.dto.AuthorResponse;
import com.example.novel.service.AuthorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
class AuthorControllerTest {

    @MockitoBean
    private AuthorService authorService;

    @Autowired
    private AuthorController authorController;

    @Test
    void search_Autocomplete_NoQuery_ShouldReturnAllAuthors() throws Exception {
        AuthorResponse author = new AuthorResponse(1L, "Author 1", LocalDate.now(), "Japan");
        List<AuthorResponse> authors = Arrays.asList(author);

        when(authorService.getAll()).thenReturn(authors);

        authorController.search(null);

        verify(authorService).getAll();
    }

    @Test
    void search_Autocomplete_WithQuery_ShouldReturnMatchingAuthors() throws Exception {
        String query = "Auth";
        AuthorResponse author = new AuthorResponse(1L, "Author 1", LocalDate.now(), "Japan");
        List<AuthorResponse> authors = Arrays.asList(author);

        when(authorService.searchByName(query)).thenReturn(authors);

        authorController.search(query);

        verify(authorService).searchByName(query);
    }

    @Test
    void search_Paged_NoQuery_ShouldReturnPageOfAuthors() throws Exception {
        AuthorResponse author = new AuthorResponse(1L, "Author 1", LocalDate.now(), "Japan");
        Page<AuthorResponse> page = new PageImpl<>(Arrays.asList(author));
        Pageable pageable = PageRequest.of(0, 10);

        when(authorService.getAll(any(Pageable.class))).thenReturn(page);

        authorController.search(null, pageable);

        verify(authorService).getAll(any(Pageable.class));
    }

    @Test
    void search_Paged_WithQuery_ShouldReturnPageOfMatchingAuthors() throws Exception {
        String query = "Auth";
        AuthorResponse author = new AuthorResponse(1L, "Author 1", LocalDate.now(), "Japan");
        Page<AuthorResponse> page = new PageImpl<>(Arrays.asList(author));
        Pageable pageable = PageRequest.of(0, 10);

        when(authorService.searchByName(eq(query), any(Pageable.class))).thenReturn(page);

        authorController.search(query, pageable);

        verify(authorService).searchByName(eq(query), any(Pageable.class));
    }

    @Test
    void get_ShouldReturnAuthor() throws Exception {
        Long id = 1L;
        AuthorResponse author = new AuthorResponse(id, "Author 1", LocalDate.now(), "Japan");

        when(authorService.get(id)).thenReturn(author);

        authorController.get(id);

        verify(authorService).get(id);
    }

    @Test
    void create_ShouldReturnCreatedAuthor() throws Exception {
        AuthorRequest request = new AuthorRequest("New Author", LocalDate.now(), "USA");
        AuthorResponse response = new AuthorResponse(1L, "New Author", LocalDate.now(), "USA");

        when(authorService.create(any(AuthorRequest.class))).thenReturn(response);

        authorController.create(request);

        verify(authorService).create(any(AuthorRequest.class));
    }

    @Test
    void update_ShouldReturnUpdatedAuthor() throws Exception {
        Long id = 1L;
        AuthorRequest request = new AuthorRequest("Updated Author", LocalDate.now(), "UK");
        AuthorResponse response = new AuthorResponse(id, "Updated Author", LocalDate.now(), "UK");

        when(authorService.update(eq(id), any(AuthorRequest.class))).thenReturn(response);

        authorController.update(id, request);

        verify(authorService).update(eq(id), any(AuthorRequest.class));
    }

    @Test
    void delete_ShouldCallServiceDelete() throws Exception {
        Long id = 1L;
        doNothing().when(authorService).delete(id);

        authorController.delete(id);

        verify(authorService).delete(id);
    }
}
