export interface Appointment {
  telefone: string;
  nome: string;
  email: string;
  statusPorteiro: string;
  status: string;
  dataHora: string;
  medico: string;
  procedimento: string;
  /** Coluna K — Tentativas_Reativacao */
  tentativasReativacao: number;
  /** Coluna I — contador auxiliar de campanha */
  campanhaReativacao: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function toInt(value: string | undefined): number {
  const n = parseInt((value ?? "0").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export function parseCSV(csvText: string): Appointment[] {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim());
  if (lines.length < 2) return [];

  const appointments: Appointment[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i] ?? "");

    const telefone = (cols[0] ?? "").trim();
    const nome = (cols[1] ?? "").trim();
    const email = (cols[2] ?? "").trim();
    const statusPorteiro = (cols[3] ?? "").trim();
    const status = (cols[4] ?? "").trim();
    const dataHora = (cols[5] ?? "").trim();
    const medico = (cols[6] ?? "").trim();
    const procedimento = (cols[7] ?? "").trim();
    // Coluna I (index 8) e Coluna K (index 10)
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
