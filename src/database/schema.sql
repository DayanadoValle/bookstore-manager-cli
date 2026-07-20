
DROP TABLE IF EXISTS emprestimos;
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS autores;


CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(80),
    data_nascimento DATE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    genero VARCHAR(80),
    ano_publicacao INTEGER,
    quantidade_total INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_total >= 0),
    quantidade_disponivel INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_disponivel >= 0),
    autor_id INTEGER NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_livros_autor
        FOREIGN KEY (autor_id) REFERENCES autores(id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_livros_disponivel_nao_excede_total
        CHECK (quantidade_disponivel <= quantidade_total)
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    data_emprestimo TIMESTAMP NOT NULL DEFAULT NOW(),
    data_devolucao_prevista DATE,
    data_devolucao_real TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'devolvido')),
    CONSTRAINT fk_emprestimos_livro
        FOREIGN KEY (livro_id) REFERENCES livros(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_emprestimos_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_livros_autor_id ON livros(autor_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos(cliente_id);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);

INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
('Machado de Assis', 'Brasileira', '1839-06-21'),
('J.K. Rowling', 'Britânica', '1965-07-31'),
('George Orwell', 'Britânica', '1903-06-25');

INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
('Dom Casmurro', 'Romance', 1899, 5, 5, 1),
('Harry Potter e a Pedra Filosofal', 'Fantasia', 1997, 3, 3, 2),
('1984', 'Distopia', 1949, 4, 4, 3);

INSERT INTO clientes (nome, email, telefone) VALUES
('Ana Silva', 'ana.silva@email.com', '(11) 91234-5678'),
('Bruno Costa', 'bruno.costa@email.com', '(21) 99876-5432');
