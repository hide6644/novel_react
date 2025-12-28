package com.example.novel.controller;

import com.example.novel.dto.NovelRequest;
import com.example.novel.dto.NovelResponse;
import com.example.novel.service.NovelService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
class NovelControllerTest {

    @MockitoBean
    private NovelService novelService;

    @Autowired
    private NovelController novelController;

    @Test
    void search_NoQuery_ShouldReturnPageOfNovels() {
        NovelResponse novel = new NovelResponse(1L, "Title", "Description", "Author", 1L, LocalDate.now(), 1);
        Page<NovelResponse> page = new PageImpl<>(Arrays.asList(novel));
        Pageable pageable = PageRequest.of(0, 10);

        when(novelService.getAll(any(Pageable.class))).thenReturn(page);

        novelController.search(null, null, pageable);

        verify(novelService).getAll(any(Pageable.class));
    }

    @Test
    void search_WithTitle_ShouldReturnPageOfMatchingNovels() {
        String title = "Title";
        NovelResponse novel = new NovelResponse(1L, "Title", "Description", "Author", 1L, LocalDate.now(), 1);
        Page<NovelResponse> page = new PageImpl<>(Arrays.asList(novel));
        Pageable pageable = PageRequest.of(0, 10);

        when(novelService.searchByTitleAndAuthorName(eq(title), eq(null), any(Pageable.class))).thenReturn(page);

        novelController.search(title, null, pageable);

        verify(novelService).searchByTitleAndAuthorName(eq(title), eq(null), any(Pageable.class));
    }

    @Test
    void search_WithAuthor_ShouldReturnPageOfMatchingNovels() {
        String author = "Author";
        NovelResponse novel = new NovelResponse(1L, "Title", "Description", "Author", 1L, LocalDate.now(), 1);
        Page<NovelResponse> page = new PageImpl<>(Arrays.asList(novel));
        Pageable pageable = PageRequest.of(0, 10);

        when(novelService.searchByTitleAndAuthorName(eq(null), eq(author), any(Pageable.class))).thenReturn(page);

        novelController.search(null, author, pageable);

        verify(novelService).searchByTitleAndAuthorName(eq(null), eq(author), any(Pageable.class));
    }

    @Test
    void search_WithTitleAndAuthor_ShouldReturnPageOfMatchingNovels() {
        String title = "Title";
        String author = "Author";
        NovelResponse novel = new NovelResponse(1L, "Title", "Description", "Author", 1L, LocalDate.now(), 1);
        Page<NovelResponse> page = new PageImpl<>(Arrays.asList(novel));
        Pageable pageable = PageRequest.of(0, 10);

        when(novelService.searchByTitleAndAuthorName(eq(title), eq(author), any(Pageable.class))).thenReturn(page);

        novelController.search(title, author, pageable);

        verify(novelService).searchByTitleAndAuthorName(eq(title), eq(author), any(Pageable.class));
    }

    @Test
    void get_ShouldReturnNovel() {
        Long id = 1L;
        NovelResponse novel = new NovelResponse(id, "Title", "Description", "Author", 1L, LocalDate.now(), 1);

        when(novelService.get(id)).thenReturn(novel);

        novelController.get(id);

        verify(novelService).get(id);
    }

    @Test
    void create_ShouldReturnCreatedNovel() {
        NovelRequest request = new NovelRequest("Title", "Description", 1L, LocalDate.now(), 1);
        NovelResponse response = new NovelResponse(1L, "Title", "Description", "Author", 1L, LocalDate.now(), 1);

        when(novelService.create(any(NovelRequest.class))).thenReturn(response);

        novelController.create(request);

        verify(novelService).create(any(NovelRequest.class));
    }

    @Test
    void update_ShouldReturnUpdatedNovel() {
        Long id = 1L;
        NovelRequest request = new NovelRequest("Updated Title", "Updated Description", 1L, LocalDate.now(), 1);
        NovelResponse response = new NovelResponse(id, "Updated Title", "Updated Description", "Author", 1L,
                LocalDate.now(), 1);

        when(novelService.update(eq(id), any(NovelRequest.class))).thenReturn(response);

        novelController.update(id, request);

        verify(novelService).update(eq(id), any(NovelRequest.class));
    }

    @Test
    void delete_ShouldCallServiceDelete() {
        Long id = 1L;
        doNothing().when(novelService).delete(id);

        novelController.delete(id);

        verify(novelService).delete(id);
    }
}
