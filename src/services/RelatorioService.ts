import { RelatorioRepository } from '../repositories/RelatorioRepository.js';

export class RelatorioService {
    constructor(private readonly relatorioRepository: RelatorioRepository = new RelatorioRepository()) {}

    async livrosDisponiveis() {
        return this.relatorioRepository.livrosDisponiveis();
    }

    async livrosEmprestados() {
        return this.relatorioRepository.livrosEmprestados();
    }

    async livrosCadastradosPorAutor() {
        return this.relatorioRepository.livrosCadastradosPorAutor();
    }

    async quantidadeEmprestimosPorLivro() {
        return this.relatorioRepository.quantidadeEmprestimosPorLivro();
    }

    async clientesComEmprestimosAtivos() {
        return this.relatorioRepository.clientesComEmprestimosAtivos();
    }
}
