import readlineSync from 'readline-sync';
import { RelatorioService } from '../services/RelatorioService.js';
import { AppError } from '../utils/AppError.js';

export class RelatorioController {
    constructor(private readonly relatorioService: RelatorioService = new RelatorioService()) {}

    async exibirMenu(): Promise<void> {
        let continuar = true;

        while (continuar) {
            console.log('\n===== MENU RELATÓRIOS =====');
            console.log('1. Livros disponíveis');
            console.log('2. Livros emprestados');
            console.log('3. Livros cadastrados por autor');
            console.log('4. Quantidade de empréstimos por livro');
            console.log('5. Clientes com empréstimos ativos');
            console.log('0. Voltar ao menu principal');

            const opcao = readlineSync.question('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1':
                        this.exibirTabela(await this.relatorioService.livrosDisponiveis());
                        break;
                    case '2':
                        this.exibirTabela(await this.relatorioService.livrosEmprestados());
                        break;
                    case '3':
                        this.exibirTabela(await this.relatorioService.livrosCadastradosPorAutor());
                        break;
                    case '4':
                        this.exibirTabela(await this.relatorioService.quantidadeEmprestimosPorLivro());
                        break;
                    case '5':
                        this.exibirClientesComEmprestimosAtivos(await this.relatorioService.clientesComEmprestimosAtivos());
                        break;
                    case '0':
                        continuar = false;
                        break;
                    default:
                        console.log('⚠️  Opção inválida. Tente novamente.');
                }
            } catch (error) {
                this.tratarErro(error);
            }
        }
    }

    private exibirTabela(linhas: any[]): void {
        if (linhas.length === 0) {
            console.log('Nenhum registro encontrado para este relatório.');
            return;
        }
        console.table(linhas);
    }

    private exibirClientesComEmprestimosAtivos(linhas: any[]): void {
        if (linhas.length === 0) {
            console.log('Nenhum registro encontrado para este relatório.');
            return;
        }
        const linhasFormatadas = linhas.map((linha) => ({
            nome: linha.nome,
            email: linha.email,
            emprestimos_ativos: linha.emprestimos_ativos,
            situacao: Number(linha.emprestimos_atrasados) > 0 ? '🔴 Atrasado' : '🟢 No prazo',
        }));
        console.table(linhasFormatadas);
    }

    private tratarErro(error: unknown): void {
        if (error instanceof AppError) {
            console.log(`⚠️  ${error.message}`);
        } else {
            console.log('❌ Ocorreu um erro inesperado:', (error as Error).message);
        }
    }
}
