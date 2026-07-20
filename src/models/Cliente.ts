export interface ClienteDTO {
    nome: string;
    email: string;
    telefone?: string;
}

export class Cliente {
    private _id: number;
    private _nome: string;
    private _email: string;
    private _telefone?: string;
    private _criadoEm?: Date;

    constructor(id: number, nome: string, email: string, telefone?: string, criadoEm?: Date) {
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._telefone = telefone;
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

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get telefone(): string | undefined {
        return this._telefone;
    }

    set telefone(telefone: string | undefined) {
        this._telefone = telefone;
    }

    get criadoEm(): Date | undefined {
        return this._criadoEm;
    }

    static fromRow(row: any): Cliente {
        return new Cliente(row.id, row.nome, row.email, row.telefone, row.criado_em);
    }
}
