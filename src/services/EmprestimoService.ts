import { EmprestimoRepository } from '../repositories/EmprestimoRepository.js';
import { LivroRepository } from '../repositories/LivroRepository.js';
import { ClienteRepository } from '../repositories/ClienteRepository.js';
import { Emprestimo, EmprestimoDTO } from '../models/Emprestimo.js';
import { AppError } from '../utils/AppError.js';


export class EmprestimoService {
    constructor(
        private readonly emprestimoRepository: EmprestimoRepository = new EmprestimoRepository(),
        private readonly livroRepository: LivroRepository = new LivroRepository(),
        private readonly clienteRepository: ClienteRepository = new ClienteRepository()
    ) {}

    async registrarEmprestimo(dados: EmprestimoDTO): Promise<Emprestimo> {
        const livro = await this.livroRepository.buscarPorId(dados.livroId);
        if (!livro) {
            throw new AppError(`Não é possível registrar o empréstimo: livro com id ${dados.livroId} não existe.`);
        }

        const cliente = await this.clienteRepository.buscarPorId(dados.clienteId);
        if (!cliente) {
            throw new AppError(`Não é possível registrar o empréstimo: cliente com id ${dados.clienteId} não existe.`);
        }

        if (dados.dataDevolucaoPrevista) {
            const hojeISO = new Date().toISOString().slice(0, 10);
            if (dados.dataDevolucaoPrevista < hojeISO) {
                throw new AppError('A data de devolução prevista não pode estar no passado.');
            }
        }

        if (!livro.possuiDisponibilidade()) {
            throw new AppError(`O livro "${livro.titulo}" não possui unidades disponíveis para empréstimo.`);
        }

        const possuiEmprestimoAtivo = await this.emprestimoRepository.clientePossuiEmprestimoAtivo(dados.clienteId);
        if (possuiEmprestimoAtivo) {
            throw new AppError(
                `O cliente "${cliente.nome}" já possui um empréstimo em aberto. É necessário devolvê-lo antes de registrar um novo.`
            );
        }

        const emprestimo = await this.emprestimoRepository.criar(dados);
        await this.livroRepository.decrementarDisponibilidade(dados.livroId);
        return emprestimo;
    }

    async registrarDevolucao(id: number): Promise<Emprestimo> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(id);
        if (!emprestimo) {
            throw new AppError(`Empréstimo com id ${id} não foi encontrado.`);
        }
        if (!emprestimo.estaAtivo()) {
            throw new AppError('Este empréstimo já foi devolvido anteriormente.');
        }

        const atualizado = await this.emprestimoRepository.registrarDevolucao(id);
        if (!atualizado) {
            throw new AppError(`Não foi possível registrar a devolução do empréstimo com id ${id}.`);
        }

        await this.livroRepository.incrementarDisponibilidade(emprestimo.livroId);
        return atualizado;
    }

    async listar(): Promise<Emprestimo[]> {
        return this.emprestimoRepository.listarTodos();
    }

    async buscarPorId(id: number): Promise<Emprestimo> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(id);
        if (!emprestimo) {
            throw new AppError(`Empréstimo com id ${id} não foi encontrado.`);
        }
        return emprestimo;
    }
}
