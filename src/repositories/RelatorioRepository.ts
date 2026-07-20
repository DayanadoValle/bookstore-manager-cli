import { pool } from "../database/connection.js";

export class RelatorioRepository {
  async livrosDisponiveis(): Promise<any[]> {
    const query = `
            SELECT l.id, l.titulo, l.quantidade_disponivel, a.nome AS autor
            FROM livros l
            INNER JOIN autores a ON a.id = l.autor_id
            WHERE l.quantidade_disponivel > 0
            ORDER BY l.titulo ASC;
        `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async livrosEmprestados(): Promise<any[]> {
    const query = `
            SELECT l.titulo, c.nome AS cliente, e.data_emprestimo, e.data_devolucao_prevista
            FROM emprestimos e
            INNER JOIN livros l ON l.id = e.livro_id
            INNER JOIN clientes c ON c.id = e.cliente_id
            WHERE e.status = 'ativo'
            ORDER BY e.data_emprestimo DESC;
        `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async livrosCadastradosPorAutor(): Promise<any[]> {
    const query = `
            SELECT a.nome AS autor, COUNT(l.id) AS total_livros
            FROM autores a
            LEFT JOIN livros l ON l.autor_id = a.id
            GROUP BY a.nome
            ORDER BY total_livros DESC;
        `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async quantidadeEmprestimosPorLivro(): Promise<any[]> {
    const query = `
            SELECT l.titulo, COUNT(e.id) AS total_emprestimos
            FROM livros l
            LEFT JOIN emprestimos e ON e.livro_id = l.id
            GROUP BY l.titulo
            ORDER BY total_emprestimos DESC
            LIMIT 20;
        `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async clientesComEmprestimosAtivos(): Promise<any[]> {
    const query = `
            SELECT
                c.nome,
                c.email,
                COUNT(e.id) AS emprestimos_ativos,
                COUNT(CASE WHEN e.data_devolucao_prevista < CURRENT_DATE THEN 1 END) AS emprestimos_atrasados
            FROM clientes c
            INNER JOIN emprestimos e ON e.cliente_id = c.id
            WHERE e.status = 'ativo'
            GROUP BY c.nome, c.email
            ORDER BY emprestimos_atrasados DESC, emprestimos_ativos DESC;
        `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }
}
