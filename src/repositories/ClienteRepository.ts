import { pool } from "../database/connection.js";
import { Cliente, ClienteDTO } from "../models/Cliente.js";

export class ClienteRepository {
  async criar(dados: ClienteDTO): Promise<Cliente> {
    const query = `
            INSERT INTO clientes (nome, email, telefone)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const valores = [dados.nome, dados.email, dados.telefone ?? null];
    const resultado = await pool.query(query, valores);
    return Cliente.fromRow(resultado.rows[0]);
  }

  async listarTodos(): Promise<Cliente[]> {
    const resultado = await pool.query(
      "SELECT * FROM clientes ORDER BY nome ASC;",
    );
    return resultado.rows.map(Cliente.fromRow);
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const resultado = await pool.query(
      "SELECT * FROM clientes WHERE id = $1;",
      [id],
    );
    if (resultado.rows.length === 0) return null;
    return Cliente.fromRow(resultado.rows[0]);
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const resultado = await pool.query(
      "SELECT * FROM clientes WHERE email = $1;",
      [email],
    );
    if (resultado.rows.length === 0) return null;
    return Cliente.fromRow(resultado.rows[0]);
  }

  async atualizar(id: number, dados: ClienteDTO): Promise<Cliente | null> {
    const query = `
            UPDATE clientes
            SET nome = $1, email = $2, telefone = $3
            WHERE id = $4
            RETURNING *;
        `;
    const valores = [dados.nome, dados.email, dados.telefone ?? null, id];
    const resultado = await pool.query(query, valores);
    if (resultado.rows.length === 0) return null;
    return Cliente.fromRow(resultado.rows[0]);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query("DELETE FROM clientes WHERE id = $1;", [
      id,
    ]);
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiEmprestimosVinculados(id: number): Promise<boolean> {
    const resultado = await pool.query(
      "SELECT 1 FROM emprestimos WHERE cliente_id = $1 LIMIT 1;",
      [id],
    );
    return (resultado.rowCount ?? 0) > 0;
  }
}
