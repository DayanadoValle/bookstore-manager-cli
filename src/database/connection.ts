import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function testarConexao(): Promise<void> {
  console.log("Entrou na função testarConexao");
  const MAX_TENTATIVAS = 10;
  const INTERVALO_MS = 2000;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      const client = await pool.connect();
      console.log("Conexão com PostgreSQL estabelecida com sucesso.");
      client.release();
      return;
    } catch (error) {
      const ultimaTentativa = tentativa === MAX_TENTATIVAS;
      if (ultimaTentativa) {
        console.error(
          "Erro ao conectar ao PostgreSQL",
          (error as Error).message,
        );
        console.error(
          "Verifique se o banco de dados está rodando e se o .env está configurado corretamente.",
        );
        process.exit(1);
      }
      console.log(
        ` Aguardando o banco de dados ficar disponível... (tentativa ${tentativa}/${MAX_TENTATIVAS})`,
      );
      await new Promise((resolve) => setTimeout(resolve, INTERVALO_MS));
    }
  }
}
