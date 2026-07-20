import { LivroRepository } from "../repositories/LivroRepository.js";
import { AutorRepository } from "../repositories/AutorRepository.js";
import { Livro, LivroDTO } from "../models/Livro.js";
import { AppError } from "../utils/AppError.js";

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository = new LivroRepository(),
    private readonly autorRepository: AutorRepository = new AutorRepository(),
  ) {}

  async cadastrar(dados: LivroDTO): Promise<Livro> {
    if (!dados.titulo || dados.titulo.trim().length === 0) {
      throw new AppError("O título do livro é obrigatório.");
    }
    if (dados.quantidadeTotal === undefined || dados.quantidadeTotal < 0) {
      throw new AppError(
        "A quantidade total do livro deve ser um número válido e não negativo.",
      );
    }

    const autor = await this.autorRepository.buscarPorId(dados.autorId);
    if (!autor) {
      throw new AppError(
        `Não é possível cadastrar o livro: autor com id ${dados.autorId} não existe.`,
      );
    }

    return this.livroRepository.criar(dados);
  }

  async listar(): Promise<Livro[]> {
    return this.livroRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) {
      throw new AppError(`Livro com id ${id} não foi encontrado.`);
    }
    return livro;
  }

  async atualizar(id: number, dados: LivroDTO): Promise<Livro> {
    const livroAtual = await this.buscarPorId(id); // valida existência do livro

    if (!dados.titulo || dados.titulo.trim().length === 0) {
      throw new AppError("O título do livro é obrigatório.");
    }
    if (
      dados.quantidadeTotal === undefined ||
      isNaN(dados.quantidadeTotal) ||
      dados.quantidadeTotal < 0
    ) {
      throw new AppError(
        "A quantidade total do livro deve ser um número válido e não negativo.",
      );
    }

    const autor = await this.autorRepository.buscarPorId(dados.autorId);
    if (!autor) {
      throw new AppError(
        `Não é possível atualizar o livro: autor com id ${dados.autorId} não existe.`,
      );
    }

    const emprestados =
      livroAtual.quantidadeTotal - livroAtual.quantidadeDisponivel;
    if (dados.quantidadeTotal < emprestados) {
      throw new AppError(
        `Não é possível reduzir a quantidade total para ${dados.quantidadeTotal}: existem ${emprestados} unidade(s) atualmente emprestada(s).`,
      );
    }
    const novaQuantidadeDisponivel = dados.quantidadeTotal - emprestados;

    const atualizado = await this.livroRepository.atualizar(
      id,
      dados,
      novaQuantidadeDisponivel,
    );
    if (!atualizado) {
      throw new AppError(`Não foi possível atualizar o livro com id ${id}.`);
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência
    const possuiVinculo =
      await this.livroRepository.possuiEmprestimosVinculados(id);
    if (possuiVinculo) {
      throw new AppError(
        "Não é possível remover o livro pois há empréstimos vinculados a ele.",
      );
    }
    await this.livroRepository.remover(id);
  }
}
