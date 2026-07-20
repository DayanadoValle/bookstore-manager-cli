import readlineSync from 'readline-sync';
import { AutorService } from '../services/AutorService.js';
import { AppError } from '../utils/AppError.js';
import { formatarData, formatarDataISO, validarData, validarIdNumerico } from '../utils/validadores.js';

export class AutorController {
    constructor(private readonly autorService: AutorService = new AutorService()) {}

    async exibirMenu(): Promise<void> {
        let continuar = true;

        while (continuar) {
            console.log('\n===== MENU AUTORES =====');
            console.log('1. Cadastrar autor');
            console.log('2. Listar autores');
            console.log('3. Consultar autor por id');
            console.log('4. Atualizar autor');
            console.log('5. Remover autor');
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
        const nome = readlineSync.question('Nome do autor: ');
        const nacionalidade = readlineSync.question('Nacionalidade (opcional): ') || undefined;
        const dataNascimentoInput = readlineSync.question('Data de nascimento AAAA-MM-DD (opcional): ');
        const dataNascimento = this.validarDataOpcional(dataNascimentoInput);

        const autor = await this.autorService.cadastrar({ nome, nacionalidade, dataNascimento });
        console.log(`✅ Autor cadastrado com sucesso! (id: ${autor.id})`);
    }

    private async listar(): Promise<void> {
        const autores = await this.autorService.listar();
        if (autores.length === 0) {
            console.log('Nenhum autor cadastrado.');
            return;
        }
        console.log('\nID | Nome | Nacionalidade | Nascimento');
        autores.forEach((a) =>
            console.log(`${a.id} | ${a.nome} | ${a.nacionalidade ?? '-'} | ${formatarData(a.dataNascimento)}`)
        );
    }

    private async consultarPorId(): Promise<void> {
        const id = this.lerId();
        const autor = await this.autorService.buscarPorId(id);
        console.log(`\nID: ${autor.id}`);
        console.log(`Nome: ${autor.nome}`);
        console.log(`Nacionalidade: ${autor.nacionalidade ?? '-'}`);
        console.log(`Nascimento: ${formatarData(autor.dataNascimento)}`);
    }

    private async atualizar(): Promise<void> {
        const id = this.lerId();
        const atual = await this.autorService.buscarPorId(id);

        console.log('\nDeixe em branco e pressione Enter para manter o valor atual.');
        console.log(`(atual: ${atual.nome})`);
        const novoNome = readlineSync.question('Novo nome: ');
        console.log(`(atual: ${atual.nacionalidade ?? '-'})`);
        const novaNacionalidade = readlineSync.question('Nova nacionalidade: ');
        const dataAtualFormatada = formatarDataISO(atual.dataNascimento);
        console.log(`(atual: ${dataAtualFormatada})`);
        const novaDataNascimentoInput = readlineSync.question('Nova data de nascimento AAAA-MM-DD: ');

        const nome = novoNome.trim() ? novoNome : atual.nome;
        const nacionalidade = novaNacionalidade.trim() ? novaNacionalidade : atual.nacionalidade;
        const dataNascimento = novaDataNascimentoInput.trim()
            ? this.validarDataOpcional(novaDataNascimentoInput)
            : (dataAtualFormatada !== '-' ? dataAtualFormatada : undefined);

        await this.autorService.atualizar(id, { nome, nacionalidade, dataNascimento });
        console.log('✅ Autor atualizado com sucesso!');
    }

    private async remover(): Promise<void> {
        const id = this.lerId();
        await this.autorService.remover(id);
        console.log('✅ Autor removido com sucesso!');
    }

    private validarDataOpcional(valor: string): string | undefined {
        if (!valor.trim()) return undefined;
        if (!validarData(valor.trim())) {
            throw new AppError('Data inválida. Use o formato AAAA-MM-DD (ex.: 1994-10-12).');
        }
        return valor.trim();
    }

    private lerId(): number {
        const entrada = readlineSync.question('Informe o id do autor: ');
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
