import readlineSync from "readline-sync";
import { AutorController } from "../controllers/AutorController.js";
import { LivroController } from "../controllers/LivroController.js";
import { ClienteController } from "../controllers/ClienteController.js";
import { EmprestimoController } from "../controllers/EmprestimoController.js";
import { RelatorioController } from "../controllers/RelatorioController.js";

export async function iniciarMenuPrincipal(): Promise<void> {
  const autorController = new AutorController();
  const livroController = new LivroController();
  const clienteController = new ClienteController();
  const emprestimoController = new EmprestimoController();
  const relatorioController = new RelatorioController();

  let continuar = true;

  while (continuar) {
    console.log("\n=======================================");
    console.log("   📚  BOOKSTORE MANAGER CLI  📚");
    console.log("=======================================");
    console.log("1. Autores");
    console.log("2. Livros");
    console.log("3. Clientes");
    console.log("4. Empréstimos");
    console.log("5. Relatórios");
    console.log("0. Encerrar aplicação");

    const opcao = readlineSync.question("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await autorController.exibirMenu();
        break;
      case "2":
        await livroController.exibirMenu();
        break;
      case "3":
        await clienteController.exibirMenu();
        break;
      case "4":
        await emprestimoController.exibirMenu();
        break;
      case "5":
        await relatorioController.exibirMenu();
        break;
      case "0":
        console.log("\n👋 Encerrando a aplicação. Até logo!");
        continuar = false;
        break;
      default:
        console.log("⚠️  Opção inválida. Tente novamente.");
    }
  }
}
