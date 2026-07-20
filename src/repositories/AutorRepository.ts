import { pool } from '../database/connection.js';
import { Autor, type AutorDTO } from '../models/Autor.js';

export class AutorRepository {
    async criar(dados: AutorDTO): Promise<Autor> {
        const query = `
            INSERT INTO autores (nome, nacionalidade, data_nascimento)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const valores = [dados.nome, dados.nacionalidade ?? null, dados.dataNascimento ?? null];
        const resultado = await pool.query(query, valores);
        return Autor.fromRow(resultado.rows[0]);
    }

    async listarTodos(): Promise<Autor[]> {
        const resultado = await pool.query('SELECT * FROM autores ORDER BY nome ASC;');
        return resultado.rows.map(Autor.fromRow);
    }

    async buscarPorId(id: number): Promise<Autor | null> {
        const resultado = await pool.query('SELECT * FROM autores WHERE id = $1;', [id]);
        if (resultado.rows.length === 0) return null;
        return Autor.fromRow(resultado.rows[0]);
    }

    async atualizar(id: number, dados: AutorDTO): Promise<Autor | null> {
        const query = `
            UPDATE autores
            SET nome = $1, nacionalidade = $2, data_nascimento = $3
            WHERE id = $4
            RETURNING *;
        `;
        const valores = [dados.nome, dados.nacionalidade ?? null, dados.dataNascimento ?? null, id];
        const resultado = await pool.query(query, valores);
        if (resultado.rows.length === 0) return null;
        return Autor.fromRow(resultado.rows[0]);
    }

    async remover(id: number): Promise<boolean> {
        const resultado = await pool.query('DELETE FROM autores WHERE id = $1;', [id]);
        return (resultado.rowCount ?? 0) > 0;
    }

    async possuiLivrosVinculados(id: number): Promise<boolean> {
        const resultado = await pool.query('SELECT 1 FROM livros WHERE autor_id = $1 LIMIT 1;', [
            id,
        ]);
        return (resultado.rowCount ?? 0) > 0;
    }
}
