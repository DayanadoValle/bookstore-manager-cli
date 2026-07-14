import { testarConexao, pool } from "./database/connection.js";

async function main(): Promise<void> {
  console.log("Iniciando BookStore CLI da Day..");

  await testarConexao();

  console.log("Banco conectado com sucesso!");

  await pool.end();
}

main().catch((error) => {
  console.error((error as Error).message);
  process.exit(1);
});
