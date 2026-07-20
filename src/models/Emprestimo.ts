export type StatusEmprestimo = 'ativo' | 'devolvido';

export interface EmprestimoDTO {
    livroId: number;
    clienteId: number;
    dataDevolucaoPrevista?: string;
}

export class Emprestimo {
    private _id: number;
    private _livroId: number;
    private _clienteId: number;
    private _dataEmprestimo: Date;
    private _dataDevolucaoPrevista?: string;
    private _dataDevolucaoReal?: Date;
    private _status: StatusEmprestimo;
    private _livroTitulo?: string;
    private _clienteNome?: string;

    constructor(
        id: number,
        livroId: number,
        clienteId: number,
        dataEmprestimo: Date,
        status: StatusEmprestimo,
        dataDevolucaoPrevista?: string,
        dataDevolucaoReal?: Date,
        livroTitulo?: string,
        clienteNome?: string
    ) {
        this._id = id;
        this._livroId = livroId;
        this._clienteId = clienteId;
        this._dataEmprestimo = dataEmprestimo;
        this._status = status;
        this._dataDevolucaoPrevista = dataDevolucaoPrevista;
        this._dataDevolucaoReal = dataDevolucaoReal;
        this._livroTitulo = livroTitulo;
        this._clienteNome = clienteNome;
    }

    get id(): number {
        return this._id;
    }

    get livroId(): number {
        return this._livroId;
    }

    get clienteId(): number {
        return this._clienteId;
    }

    get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }

    get dataDevolucaoPrevista(): string | undefined {
        return this._dataDevolucaoPrevista;
    }

    get dataDevolucaoReal(): Date | undefined {
        return this._dataDevolucaoReal;
    }

    get status(): StatusEmprestimo {
        return this._status;
    }

    set status(status: StatusEmprestimo) {
        this._status = status;
    }

    get livroTitulo(): string | undefined {
        return this._livroTitulo;
    }

    get clienteNome(): string | undefined {
        return this._clienteNome;
    }

    estaAtivo(): boolean {
        return this._status === 'ativo';
    }

    
    estaAtrasado(): boolean {
        if (!this.estaAtivo() || !this._dataDevolucaoPrevista) {
            return false;
        }
        const hojeISO = new Date().toISOString().slice(0, 10);
        const previstaISO = new Date(this._dataDevolucaoPrevista).toISOString().slice(0, 10);
        return previstaISO < hojeISO;
    }

    static fromRow(row: any): Emprestimo {
        return new Emprestimo(
            row.id,
            row.livro_id,
            row.cliente_id,
            row.data_emprestimo,
            row.status,
            row.data_devolucao_prevista,
            row.data_devolucao_real,
            row.livro_titulo,
            row.cliente_nome
        );
    }
}
