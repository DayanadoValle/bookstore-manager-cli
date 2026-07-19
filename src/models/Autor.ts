
export interface AutorDTO {
    nome: string;
    nacionalidade?: string;
    dataNascimento?: string;
}

export class Autor {
    private _id: number;
    private _nome: string;
    private _nacionalidade?: string;
    private _dataNascimento?: string;
    private _criadoEm?: Date;

    constructor(
        id: number,
        nome: string,
        nacionalidade?: string,
        dataNascimento?: string,
        criadoEm?: Date
    ) {
        this._id = id;
        this._nome = nome;
        this._nacionalidade = nacionalidade;
        this._dataNascimento = dataNascimento;
        this._criadoEm = criadoEm;
    }

    get id(): number {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    set nome(nome: string) {
        this._nome = nome;
    }

    get nacionalidade(): string | undefined {
        return this._nacionalidade;
    }

    set nacionalidade(nacionalidade: string | undefined) {
        this._nacionalidade = nacionalidade;
    }

    get dataNascimento(): string | undefined {
        return this._dataNascimento;
    }

    set dataNascimento(dataNascimento: string | undefined) {
        this._dataNascimento = dataNascimento;
    }

    get criadoEm(): Date | undefined {
        return this._criadoEm;
    }

   
    static fromRow(row: any): Autor {
        return new Autor(row.id, row.nome, row.nacionalidade, row.data_nascimento, row.criado_em);
    }
}
