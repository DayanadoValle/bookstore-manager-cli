export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarIdNumerico(valor: string): number | null {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    return null;
  }
  return numero;
}

export function validarData(data: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) return false;

  const [ano, mes, dia] = data.split("-").map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    d.getUTCFullYear() === ano &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia
  );
}

export function formatarData(data: Date | string | undefined): string {
  if (!data) return "-";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

export function formatarDataISO(data: Date | string | undefined): string {
  if (!data) return "-";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}
