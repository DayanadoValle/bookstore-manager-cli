import { pool } from '../database/connection.js';
import { Livro, LivroDTO } from '../models/Livro.js';


export class LivroRepository {
    private readonly selectComAutor = `
        SELECT l.*, a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a ON a.id = l.autor_id
    `;

    async criar(dados: LivroDTO): Promise<Livro> {
        const query = `
            INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
            VALUES ($1, $2, $3, $4, $4, $5)
            RETURNING *;
        `;
        const valores = [
            dados.titulo,
            dados.genero ?? null,
            dados.anoPublicacao ?? null,
            dados.quantidadeTotal,
            dados.autorId,
        ];
        const resultado = await pool.query(query, valores);
        return Livro.fromRow(resultado.rows[0]);
    }

    async listarTodos(): Promise<Livro[]> {
        const resultado = await pool.query(`${this.selectComAutor} ORDER BY l.titulo ASC;`);
        return resultado.rows.map(Livro.fromRow);
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const resultado = await pool.query(`${this.selectComAutor} WHERE l.id = $1;`, [id]);
        if (resultado.rows.length === 0) return null;
        return Livro.fromRow(resultado.rows[0]);
    }

 
    async atualizar(id: number, dados: LivroDTO, quantidadeDisponivel: number): Promise<Livro | null> {
        const query = `
            UPDATE livros
            SET titulo = $1, genero = $2, ano_publicacao = $3, quantidade_total = $4,
                quantidade_disponivel = $5, autor_id = $6
            WHERE id = $7
            RETURNING *;
        `;
        const valores = [
            dados.titulo,
            dados.genero ?? null,
            dados.anoPublicacao ?? null,
            dados.quantidadeTotal,
            quantidadeDisponivel,
            dados.autorId,
            id,
        ];
        const resultado = await pool.query(query, valores);
        if (resultado.rows.length === 0) return null;
        return Livro.fromRow(resultado.rows[0]);
    }

    async remover(id: number): Promise<boolean> {
        const resultado = await pool.query('DELETE FROM livros WHERE id = $1;', [id]);
        return (resultado.rowCount ?? 0) > 0;
    }

    
    async decrementarDisponibilidade(id: number): Promise<void> {
        await pool.query(
            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = $1;',
            [id]
        );
    }

    async incrementarDisponibilidade(id: number): Promise<void> {
        await pool.query(
            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1;',
            [id]
        );
    }

    async possuiEmprestimosVinculados(id: number): Promise<boolean> {
        const resultado = await pool.query('SELECT 1 FROM emprestimos WHERE livro_id = $1 LIMIT 1;', [id]);
        return (resultado.rowCount ?? 0) > 0;
    }
}
