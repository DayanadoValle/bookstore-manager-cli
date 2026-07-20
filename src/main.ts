/*import { testarConexao, pool } from "./database/connection.js";

async function main(): Promise<void> {
  console.log("Iniciando BookStore CLI da Day..");

  await testarConexao();

  console.log("Banco conectado com sucesso!");

  await pool.end();
}

main().catch((error) => {
  console.error((error as Error).message);
  process.exit(1);
}); */

import { execSync } from 'child_process';
import { testarConexao, pool } from './database/connection.js';
import { iniciarMenuPrincipal } from './menus/menuPrincipal.js';

function ajustarEncodingWindows(): void {
    if (process.platform === 'win32') {
        try {
            execSync('chcp 65001', { stdio: 'ignore' });
        } catch {
            // Se não for possível ajustar, a aplicação continua funcionando normalmente,
            // apenas caracteres acentuados podem aparecer incorretos no terminal.
        }
    }
}

async function main(): Promise<void> {
    ajustarEncodingWindows();
    console.log('Iniciando BookStore Manager CLI...');
    await testarConexao();
    await iniciarMenuPrincipal();
    await pool.end();
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Erro fatal ao iniciar a aplicação:', (error as Error).message);
    process.exit(1);
});
