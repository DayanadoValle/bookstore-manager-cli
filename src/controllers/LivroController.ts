import readlineSync from 'readline-sync';
import { LivroService } from '../services/LivroService.js';
import { AppError } from '../utils/AppError.js';
import { validarIdNumerico } from '../utils/validadores.js';

export class LivroController {
    constructor(private readonly livroService: LivroService = new LivroService()) {}

    async exibirMenu(): Promise<void> {
        let continuar = true;

        while (continuar) {
            console.log('\n===== MENU LIVROS =====');
            console.log('1. Cadastrar livro');
            console.log('2. Listar livros');
            console.log('3. Consultar livro por id');
            console.log('4. Atualizar livro');
            console.log('5. Remover livro');
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
        const titulo = readlineSync.question('Título do livro: ');
        const genero = readlineSync.question('Gênero (opcional): ') || undefined;
        const anoPublicacao = this.lerInteiroOpcional(readlineSync.question('Ano de publicação (opcional): '), 'ano de publicação');
        const quantidadeTotal = this.lerInteiroNaoNegativo(
            readlineSync.question('Quantidade total em estoque: '),
            'quantidade total'
        );
        const autorId = this.lerNumero('Id do autor: ');

        const livro = await this.livroService.cadastrar({ titulo, genero, anoPublicacao, quantidadeTotal, autorId });
        console.log(`✅ Livro cadastrado com sucesso! (id: ${livro.id})`);
    }

    private async listar(): Promise<void> {
        const livros = await this.livroService.listar();
        if (livros.length === 0) {
            console.log('Nenhum livro cadastrado.');
            return;
        }
        console.log('\nID | Título | Autor | Disponível/Total');
        livros.forEach((l) =>
            console.log(`${l.id} | ${l.titulo} | ${l.autorNome ?? '-'} | ${l.quantidadeDisponivel}/${l.quantidadeTotal}`)
        );
    }

    private async consultarPorId(): Promise<void> {
        const id = this.lerId();
        const livro = await this.livroService.buscarPorId(id);
        console.log(`\nID: ${livro.id}`);
        console.log(`Título: ${livro.titulo}`);
        console.log(`Gênero: ${livro.genero ?? '-'}`);
        console.log(`Ano: ${livro.anoPublicacao ?? '-'}`);
        console.log(`Autor: ${livro.autorNome ?? '-'}`);
        console.log(`Disponível/Total: ${livro.quantidadeDisponivel}/${livro.quantidadeTotal}`);
    }

    private async atualizar(): Promise<void> {
        const id = this.lerId();
        const atual = await this.livroService.buscarPorId(id);

        console.log('\nDeixe em branco e pressione Enter para manter o valor atual.');

        console.log(`(atual: ${atual.titulo})`);
        const novoTitulo = readlineSync.question('Novo título: ');

        console.log(`(atual: ${atual.genero ?? '-'})`);
        const novoGenero = readlineSync.question('Novo gênero: ');

        console.log(`(atual: ${atual.anoPublicacao ?? '-'})`);
        const novoAnoStr = readlineSync.question('Novo ano de publicação: ');

        console.log(`(atual: ${atual.quantidadeTotal})`);
        const novaQuantidadeStr = readlineSync.question('Nova quantidade total em estoque: ');

        console.log(`(atual: ${atual.autorId})`);
        const novoAutorIdStr = readlineSync.question('Novo id do autor: ');

        const titulo = novoTitulo.trim() ? novoTitulo : atual.titulo;
        const genero = novoGenero.trim() ? novoGenero : atual.genero;
        const anoPublicacao = novoAnoStr.trim()
            ? this.lerInteiroOpcional(novoAnoStr, 'ano de publicação')
            : atual.anoPublicacao;
        const quantidadeTotal = novaQuantidadeStr.trim()
            ? this.lerInteiroNaoNegativo(novaQuantidadeStr, 'quantidade total')
            : atual.quantidadeTotal;
        const autorId = novoAutorIdStr.trim()
            ? this.lerInteiroNaoNegativo(novoAutorIdStr, 'id do autor')
            : atual.autorId;

        await this.livroService.atualizar(id, { titulo, genero, anoPublicacao, quantidadeTotal, autorId });
        console.log('✅ Livro atualizado com sucesso!');
    }

    private async remover(): Promise<void> {
        const id = this.lerId();
        await this.livroService.remover(id);
        console.log('✅ Livro removido com sucesso!');
    }

    private lerId(): number {
        return this.lerNumero('Informe o id do livro: ');
    }

   
    private lerInteiroNaoNegativo(valor: string, campo: string): number {
        const numero = Number(valor);
        if (valor.trim() === '' || isNaN(numero) || !Number.isInteger(numero) || numero < 0) {
            throw new AppError(`O campo "${campo}" deve ser um número inteiro válido e não negativo.`);
        }
        return numero;
    }

    
    private lerInteiroOpcional(valor: string, campo: string): number | undefined {
        if (!valor.trim()) return undefined;
        const numero = Number(valor);
        if (isNaN(numero) || !Number.isInteger(numero)) {
            throw new AppError(`O campo "${campo}" deve ser um número inteiro válido.`);
        }
        return numero;
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
