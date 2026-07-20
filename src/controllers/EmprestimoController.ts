import readlineSync from 'readline-sync';
import { EmprestimoService } from '../services/EmprestimoService.js';
import { AppError } from '../utils/AppError.js';
import { formatarData, validarData, validarIdNumerico } from '../utils/validadores.js';

export class EmprestimoController {
    constructor(private readonly emprestimoService: EmprestimoService = new EmprestimoService()) {}

    async exibirMenu(): Promise<void> {
        let continuar = true;

        while (continuar) {
            console.log('\n===== MENU EMPRÉSTIMOS =====');
            console.log('1. Registrar empréstimo');
            console.log('2. Registrar devolução');
            console.log('3. Listar empréstimos');
            console.log('4. Consultar empréstimo por id');
            console.log('0. Voltar ao menu principal');

            const opcao = readlineSync.question('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1':
                        await this.registrarEmprestimo();
                        break;
                    case '2':
                        await this.registrarDevolucao();
                        break;
                    case '3':
                        await this.listar();
                        break;
                    case '4':
                        await this.consultarPorId();
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

    private async registrarEmprestimo(): Promise<void> {
        const livroId = this.lerNumero('Id do livro: ');
        const clienteId = this.lerNumero('Id do cliente: ');
        const dataInput = readlineSync.question(
            'Data prevista de devolução AAAA-MM-DD (opcional): '
        );
        let dataDevolucaoPrevista: string | undefined;
        if (dataInput.trim()) {
            if (!validarData(dataInput.trim())) {
                throw new AppError('Data inválida. Use o formato AAAA-MM-DD (ex.: 2026-07-20).');
            }
            dataDevolucaoPrevista = dataInput.trim();
        }

        const emprestimo = await this.emprestimoService.registrarEmprestimo({
            livroId,
            clienteId,
            dataDevolucaoPrevista,
        });
        console.log(`✅ Empréstimo registrado com sucesso! (id: ${emprestimo.id})`);
    }

    private async registrarDevolucao(): Promise<void> {
        const id = this.lerNumero('Id do empréstimo: ');
        await this.emprestimoService.registrarDevolucao(id);
        console.log('✅ Devolução registrada com sucesso!');
    }

    private async listar(): Promise<void> {
        const emprestimos = await this.emprestimoService.listar();
        if (emprestimos.length === 0) {
            console.log('Nenhum empréstimo registrado.');
            return;
        }
        console.log('\nID | Livro | Cliente | Data empréstimo | Status');
        emprestimos.forEach((e) => {
            const statusExibicao = e.estaAtrasado() ? 'atrasado 🔴' : e.status;
            console.log(
                `${e.id} | ${e.livroTitulo ?? '-'} | ${e.clienteNome ?? '-'} | ${formatarData(e.dataEmprestimo)} | ${statusExibicao}`
            );
        });
    }

    private async consultarPorId(): Promise<void> {
        const id = this.lerNumero('Informe o id do empréstimo: ');
        const emprestimo = await this.emprestimoService.buscarPorId(id);
        console.log(`\nID: ${emprestimo.id}`);
        console.log(`Livro: ${emprestimo.livroTitulo ?? '-'}`);
        console.log(`Cliente: ${emprestimo.clienteNome ?? '-'}`);
        console.log(`Data do empréstimo: ${formatarData(emprestimo.dataEmprestimo)}`);
        console.log(`Devolução prevista: ${formatarData(emprestimo.dataDevolucaoPrevista)}`);
        console.log(`Devolução real: ${formatarData(emprestimo.dataDevolucaoReal)}`);
        const statusExibicao = emprestimo.estaAtrasado() ? 'atrasado 🔴' : emprestimo.status;
        console.log(`Status: ${statusExibicao}`);
    }

    private lerNumero(mensagem: string): number {
        const entrada = readlineSync.question(mensagem);
        const valor = validarIdNumerico(entrada);
        if (valor === null) {
            throw new AppError('O valor informado é inválido.');
        }
        return valor;
    }

    private tratarErro(error: unknown): void {
        if (error instanceof AppError) {
            console.log(`⚠️  ${error.message}`);
        } else {
            console.log('❌ Ocorreu um erro inesperado:', (error as Error).message);
        }
    }
}
