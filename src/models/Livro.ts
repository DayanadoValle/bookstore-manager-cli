export interface LivroDTO {
  titulo: string;
  genero?: string;
  anoPublicacao?: number;
  quantidadeTotal: number;
  autorId: number;
}

export class Livro {
  private _id: number;
  private _titulo: string;
  private _genero?: string;
  private _anoPublicacao?: number;
  private _quantidadeTotal: number;
  private _quantidadeDisponivel: number;
  private _autorId: number;
  private _autorNome?: string;
  private _criadoEm?: Date;

  constructor(
    id: number,
    titulo: string,
    quantidadeTotal: number,
    quantidadeDisponivel: number,
    autorId: number,
    genero?: string,
    anoPublicacao?: number,
    autorNome?: string,
    criadoEm?: Date,
  ) {
    this._id = id;
    this._titulo = titulo;
    this._quantidadeTotal = quantidadeTotal;
    this._quantidadeDisponivel = quantidadeDisponivel;
    this._autorId = autorId;
    this._genero = genero;
    this._anoPublicacao = anoPublicacao;
    this._autorNome = autorNome;
    this._criadoEm = criadoEm;
  }

  get id(): number {
    return this._id;
  }

  get titulo(): string {
    return this._titulo;
  }

  set titulo(titulo: string) {
    this._titulo = titulo;
  }

  get genero(): string | undefined {
    return this._genero;
  }

  set genero(genero: string | undefined) {
    this._genero = genero;
  }

  get anoPublicacao(): number | undefined {
    return this._anoPublicacao;
  }

  set anoPublicacao(ano: number | undefined) {
    this._anoPublicacao = ano;
  }

  get quantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  set quantidadeTotal(quantidade: number) {
    this._quantidadeTotal = quantidade;
  }

  get quantidadeDisponivel(): number {
    return this._quantidadeDisponivel;
  }

  set quantidadeDisponivel(quantidade: number) {
    this._quantidadeDisponivel = quantidade;
  }

  get autorId(): number {
    return this._autorId;
  }

  get autorNome(): string | undefined {
    return this._autorNome;
  }

  get criadoEm(): Date | undefined {
    return this._criadoEm;
  }

  possuiDisponibilidade(): boolean {
    return this._quantidadeDisponivel > 0;
  }

  static fromRow(row: any): Livro {
    return new Livro(
      row.id,
      row.titulo,
      row.quantidade_total,
      row.quantidade_disponivel,
      row.autor_id,
      row.genero,
      row.ano_publicacao,
      row.autor_nome,
      row.criado_em,
    );
  }
}
