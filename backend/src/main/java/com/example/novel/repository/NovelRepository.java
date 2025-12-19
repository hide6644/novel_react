package com.example.novel.repository;

import com.example.novel.entity.Novel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NovelRepository extends JpaRepository<Novel, Long> {
    @EntityGraph(attributePaths = "author")
    Page<Novel> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    @Query("SELECT n FROM Novel n WHERE " +
            "(:title IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:authorName IS NULL OR LOWER(n.author.name) LIKE LOWER(CONCAT('%', :authorName, '%')))")
    Page<Novel> search(@Param("title") String title, @Param("authorName") String authorName, Pageable pageable);
}
