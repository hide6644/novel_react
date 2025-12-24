package com.example.novel.repository;

import com.example.novel.entity.Author;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    List<Author> findByNameContainingIgnoreCase(String name);

    Page<Author> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
