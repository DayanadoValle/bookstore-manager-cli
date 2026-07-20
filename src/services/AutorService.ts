import { AutorRepository } from "../repositories/AutorRepository.js";
import { Autor, AutorDTO } from "../models/Autor.js";
import { AppError } from "../utils/AppError.js";

export class AutorService {
  constructor(
    private readonly autorRepository: AutorRepository = new AutorRepository(),
  ) {}

  async cadastrar(dados: AutorDTO): Promise<Autor> {
    if (!dados.nome || dados.nome.trim().length === 0) {
      throw new AppError("O nome do autor é obrigatório.");
    }
    return this.autorRepository.criar(dados);
  }

  async listar(): Promise<Autor[]> {
    return this.autorRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new AppError(`Autor com id ${id} não foi encontrado.`);
    }
    return autor;
  }

  async atualizar(id: number, dados: AutorDTO): Promise<Autor> {
    await this.buscarPorId(id);
    if (!dados.nome || dados.nome.trim().length === 0) {
      throw new AppError("O nome do autor é obrigatório.");
    }
    const atualizado = await this.autorRepository.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError(`Não foi possível atualizar o autor com id ${id}.`);
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    const possuiVinculo = await this.autorRepository.possuiLivrosVinculados(id);
    if (possuiVinculo) {
      throw new AppError(
        "Não é possível remover o autor pois há livros vinculados a ele.",
      );
    }
    await this.autorRepository.remover(id);
  }
}
