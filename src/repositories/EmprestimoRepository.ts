import { pool } from '../database/connection.js';
import { Emprestimo, EmprestimoDTO } from '../models/Emprestimo.js';


export class EmprestaimoRepository {
    private readonly selectComJoins = `
        SELECT e.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
        FROM emprestimos e
        INNER JOIN livros l ON l.id = e.livro_id
        INNER JOIN clientes c ON c.id = e.cliente_id
    `;

    async criar(dados: EmprestimoDTO): Promise<Emprestimo> {
        const query = `
            INSERT INTO emprestimos (livro_id, cliente_id, data_devolucao_prevista, status)
            VALUES ($1, $2, $3, 'ativo')
            RETURNING *;
        `;
        const valores = [dados.livroId, dados.clienteId, dados.dataDevolucaoPrevista ?? null];
        const resultado = await pool.query(query, valores);
        return Emprestimo.fromRow(resultado.rows[0]);
    }

    async listarTodos(): Promise<Emprestimo[]> {
        const resultado = await pool.query(`${this.selectComJoins} ORDER BY e.data_emprestimo DESC;`);
        return resultado.rows.map(Emprestimo.fromRow);
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        const resultado = await pool.query(`${this.selectComJoins} WHERE e.id = $1;`, [id]);
        if (resultado.rows.length === 0) return null;
        return Emprestimo.fromRow(resultado.rows[0]);
    }

    
    async registrarDevolucao(id: number): Promise<Emprestimo | null> {
        const query = `
            UPDATE emprestimos
            SET status = 'devolvido', data_devolucao_real = NOW()
            WHERE id = $1
            RETURNING *;
        `;
        const resultado = await pool.query(query, [id]);
        if (resultado.rows.length === 0) return null;
        return Emprestimo.fromRow(resultado.rows[0]);
    }

    
    async clientePossuiEmprestimoAtivo(clienteId: number): Promise<boolean> {
        const resultado = await pool.query(
            "SELECT 1 FROM emprestimos WHERE cliente_id = $1 AND status = 'ativo' LIMIT 1;",
            [clienteId]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}
