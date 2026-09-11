export interface Appointment {
  telefone: string;
  nome: string;
  email: string;
  statusPorteiro: string;
  /** Coluna E — Status */
  status: string;
  dataHora: string;
  medico: string;
  /** Coluna H — Procedimento */
  procedimento: string;
  /** Coluna K — Tentativas_Reativacao */
  tentativasReativacao: number;
  /** Coluna I — contador auxiliar de campanha */
  campanhaReativacao: number;
}

/**
 * Divide o CSV bruto em linhas/colunas respeitando aspas — inclusive quebras
 * de linha dentro de células, que o GViz devolve com frequência.
 */
function parseCSVGrid(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(current.trim());
      current = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  if (row.some((c) => c !== "")) rows.push(row);

  return rows;
}

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] ?? "";
  const commas = (firstLine.match(/,/g) ?? []).length;
  const semis = (firstLine.match(/;/g) ?? []).length;
  const tabs = (firstLine.match(/\t/g) ?? []).length;
  if (semis > commas && semis >= tabs) return ";";
  if (tabs > commas && tabs > semis) return "\t";
  return ",";
}

function toInt(value: string | undefined): number {
  const n = parseInt((value ?? "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

/** Reconhece a linha de cabeçalho da planilha para não tratá-la como paciente. */
function isHeaderRow(cols: string[]): boolean {
  const joined = cols.join(" ").toLowerCase();
  return (
    joined.includes("telefone") ||
    joined.includes("nome") ||
    joined.includes("status") ||
    joined.includes("procedimento")
  );
}

/**
 * Mapeamento fixo por posição de coluna da planilha:
 * A telefone · B nome · C email · D status porteiro · E status ·
 * F data/hora · G médico · H procedimento · I campanha · K reativação.
 */
export function parseCSV(csvText: string): Appointment[] {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) return [];

  const grid = parseCSVGrid(text, detectDelimiter(text));
  if (grid.length === 0) return [];

  const startIndex = isHeaderRow(grid[0] ?? []) ? 1 : 0;
  const appointments: Appointment[] = [];

  for (let i = startIndex; i < grid.length; i++) {
    const cols = grid[i] ?? [];

    const telefone = (cols[0] ?? "").trim();
    const nome = (cols[1] ?? "").trim();
    const email = (cols[2] ?? "").trim();
    const statusPorteiro = (cols[3] ?? "").trim();
    const status = (cols[4] ?? "").trim();
    const dataHora = (cols[5] ?? "").trim();
    const medico = (cols[6] ?? "").trim();
    const procedimento = (cols[7] ?? "").trim();
    const campanhaReativacao = toInt(cols[8]);
    const tentativasReativacao = toInt(cols[10]);

    if (!nome && !status && !telefone) continue;

    appointments.push({
      telefone,
      nome,
      email,
      statusPorteiro,
      status,
      dataHora,
      medico,
      procedimento,
      tentativasReativacao,
      campanhaReativacao,
    });
  }

  return appointments;
}

/** Sem dados fictícios: a tela depende exclusivamente da planilha real. */
export const mockAppointments: Appointment[] = [];
