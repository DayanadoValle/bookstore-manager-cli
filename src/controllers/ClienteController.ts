import readlineSync from 'readline-sync';
import { ClienteService } from '../services/ClienteService.js';
import { AppError } from '../utils/AppError.js';
import { validarIdNumerico } from '../utils/validadores.js';

export class ClienteController {
    constructor(private readonly clienteService: ClienteService = new ClienteService()) {}

    async exibirMenu(): Promise<void> {
        let continuar = true;

        while (continuar) {
            console.log('\n===== MENU CLIENTES =====');
            console.log('1. Cadastrar cliente');
            console.log('2. Listar clientes');
            console.log('3. Consultar cliente por id');
            console.log('4. Atualizar cliente');
            console.log('5. Remover cliente');
            console.log('0. Voltar ao menu principal');

            const opcao = readlineSync.question('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1':
                        await this.cadastrar();
                        break;
                    case '2':
                        await this.listar();
                        break;
                    case '3':
                        await this.consultarPorId();
                        break;
                    case '4':
                        await this.atualizar();
                        break;
                    case '5':
                        await this.remover();
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

    private async cadastrar(): Promise<void> {
        const nome = readlineSync.question('Nome do cliente: ');
        const email = readlineSync.question('E-mail do cliente: ');
        const telefone = readlineSync.question('Telefone (opcional): ') || undefined;

        const cliente = await this.clienteService.cadastrar({
            nome,
            email,
            telefone,
        });
        console.log(`✅ Cliente cadastrado com sucesso! (id: ${cliente.id})`);
    }

    private async listar(): Promise<void> {
        const clientes = await this.clienteService.listar();
        if (clientes.length === 0) {
            console.log('Nenhum cliente cadastrado.');
            return;
        }
        console.log('\nID | Nome | E-mail | Telefone');
        clientes.forEach((c) =>
            console.log(`${c.id} | ${c.nome} | ${c.email} | ${c.telefone ?? '-'}`)
        );
    }

    private async consultarPorId(): Promise<void> {
        const id = this.lerId();
        const cliente = await this.clienteService.buscarPorId(id);
        console.log(`\nID: ${cliente.id}`);
        console.log(`Nome: ${cliente.nome}`);
        console.log(`E-mail: ${cliente.email}`);
        console.log(`Telefone: ${cliente.telefone ?? '-'}`);
    }

    private async atualizar(): Promise<void> {
        const id = this.lerId();
        const atual = await this.clienteService.buscarPorId(id);

        console.log('\nDeixe em branco e pressione Enter para manter o valor atual.');
        console.log(`(atual: ${atual.nome})`);
        const novoNome = readlineSync.question('Novo nome: ');
        console.log(`(atual: ${atual.email})`);
        const novoEmail = readlineSync.question('Novo e-mail: ');
        console.log(`(atual: ${atual.telefone ?? '-'})`);
        const novoTelefone = readlineSync.question('Novo telefone: ');

        const nome = novoNome.trim() ? novoNome : atual.nome;
        const email = novoEmail.trim() ? novoEmail : atual.email;
        const telefone = novoTelefone.trim() ? novoTelefone : atual.telefone;

        await this.clienteService.atualizar(id, { nome, email, telefone });
        console.log('✅ Cliente atualizado com sucesso!');
    }

    private async remover(): Promise<void> {
        const id = this.lerId();
        await this.clienteService.remover(id);
        console.log('✅ Cliente removido com sucesso!');
    }

    private lerId(): number {
        const entrada = readlineSync.question('Informe o id do cliente: ');
        const id = validarIdNumerico(entrada);
        if (id === null) {
            throw new AppError('O id informado é inválido.');
        }
        return id;
    }

    private tratarErro(error: unknown): void {
        if (error instanceof AppError) {
            console.log(`⚠️  ${error.message}`);
        } else {
            console.log('❌ Ocorreu um erro inesperado:', (error as Error).message);
        }
    }
}
