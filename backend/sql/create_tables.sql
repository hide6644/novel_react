-- Create tables script

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    expiry_date DATE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    version INT NOT NULL DEFAULT 0
);

-- Authors Table
CREATE TABLE IF NOT EXISTS authors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    version INT NOT NULL DEFAULT 0
);

-- Novels Table
CREATE TABLE IF NOT EXISTS novels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publish_date DATE,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    version INT NOT NULL DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
