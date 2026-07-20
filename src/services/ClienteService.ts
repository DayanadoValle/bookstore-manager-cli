import { ClienteRepository } from '../repositories/ClienteRepository.js';
import { Cliente, ClienteDTO } from '../models/Cliente.js';
import { AppError } from '../utils/AppError.js';
import { validarEmail } from '../utils/validadores.js';

export class ClienteService {
    constructor(private readonly clienteRepository: ClienteRepository = new ClienteRepository()) {}

    async cadastrar(dados: ClienteDTO): Promise<Cliente> {
        if (!dados.nome || dados.nome.trim().length === 0) {
            throw new AppError('O nome do cliente é obrigatório.');
        }
        if (!dados.email || !validarEmail(dados.email)) {
            throw new AppError('Informe um e-mail válido para o cliente.');
        }

        const existente = await this.clienteRepository.buscarPorEmail(dados.email);
        if (existente) {
            throw new AppError(`Já existe um cliente cadastrado com o e-mail ${dados.email}.`);
        }

        return this.clienteRepository.criar(dados);
    }

    async listar(): Promise<Cliente[]> {
        return this.clienteRepository.listarTodos();
    }

    async buscarPorId(id: number): Promise<Cliente> {
        const cliente = await this.clienteRepository.buscarPorId(id);
        if (!cliente) {
            throw new AppError(`Cliente com id ${id} não foi encontrado.`);
        }
        return cliente;
    }

    async atualizar(id: number, dados: ClienteDTO): Promise<Cliente> {
        await this.buscarPorId(id); // valida existência

        if (!dados.nome || dados.nome.trim().length === 0) {
            throw new AppError('O nome do cliente é obrigatório.');
        }
        if (!dados.email || !validarEmail(dados.email)) {
            throw new AppError('Informe um e-mail válido para o cliente.');
        }

        const existente = await this.clienteRepository.buscarPorEmail(dados.email);
        if (existente && existente.id !== id) {
            throw new AppError(`Já existe outro cliente cadastrado com o e-mail ${dados.email}.`);
        }

        const atualizado = await this.clienteRepository.atualizar(id, dados);
        if (!atualizado) {
            throw new AppError(`Não foi possível atualizar o cliente com id ${id}.`);
        }
        return atualizado;
    }

    async remover(id: number): Promise<void> {
        await this.buscarPorId(id); // valida existência
        const possuiVinculo = await this.clienteRepository.possuiEmprestimosVinculados(id);
        if (possuiVinculo) {
            throw new AppError('Não é possível remover o cliente pois há empréstimos vinculados a ele.');
        }
        await this.clienteRepository.remover(id);
    }
}
