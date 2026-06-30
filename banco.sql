CREATE DATABASE IF NOT EXISTS cozinha
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cozinha;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  quantidade DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unidade VARCHAR(30) NOT NULL,
  validade DATE NULL,
  minimo DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_estoque_nome (nome)
);

INSERT INTO usuarios (nome, email, senha)
VALUES ('Admin Cozinha', 'cozinha@teste.com', '123456')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  senha = VALUES(senha);

INSERT INTO estoque (nome, quantidade, unidade, validade, minimo)
VALUES
  ('Arroz', 25, 'kg', NULL, 10),
  ('Feijao', 8, 'kg', NULL, 6),
  ('Azeite', 3, 'L', NULL, 4),
  ('File de frango', 12, 'kg', NULL, 8)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome);
