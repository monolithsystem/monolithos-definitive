export type StatusStyle = {
  label: string;
  className: string;
  dot: string;
  hex: string;
  pulse: boolean;
};

/** Paleta estrita de alta costura — pílula translúcida + micro ponto brilhante. */
const EMERALD =
  "bg-emerald-100 text-zinc-900 ring-1 ring-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20";
const GOLD =
  "bg-amber-100 text-zinc-900 ring-1 ring-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20";
const ORANGE =
  "bg-orange-100 text-zinc-900 ring-1 ring-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/25";
const VIOLET =
  "bg-violet-100 text-zinc-900 ring-1 ring-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/25";
const CYAN =
  "bg-cyan-100 text-zinc-900 ring-1 ring-cyan-500/40 dark:bg-sky-500/10 dark:text-cyan-300 dark:ring-cyan-500/25";
const PLATINUM =
  "bg-slate-200 text-zinc-900 ring-1 ring-slate-400/50 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20";
/** Fallback de segurança: status vazio ou desconhecido. */
const TITANIUM =
  "bg-slate-100 text-slate-700 ring-1 ring-slate-300 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700";
/** Vermelho rubi / carmim de urgência — pendente atendente. */
const RUBY =
  "bg-rose-50 text-rose-800 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/20";
/** Cinza carbono apagado — cancelado (dado morto). */
const CARBON =
  "bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-900/60 dark:text-zinc-600 dark:border-zinc-800";

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getStatusStyle(status?: string | null): StatusStyle {
  const s = (status ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Fallback de segurança: coluna E vazia, nula ou sem status preenchido.
  if (!s) {
    return {
      label: "Pendente",
      className: TITANIUM,
      dot: "bg-slate-500 dark:bg-zinc-500",
      hex: "#334155",
      pulse: false,
    };
  }


  // 3. Espera + confirmação → laranja neon suave
  if (s.includes("espera") && s.includes("confirma")) {
    return {
      label: "À Espera Confirmação",
      className: ORANGE,
      dot: "bg-orange-400",
      hex: "#FB923C",
      pulse: true,
    };
  }

  // 4. Espera + reagendamento → roxo elétrico
  if (s.includes("espera") && s.includes("reagenda")) {
    return {
      label: "À Espera Reagendamento",
      className: VIOLET,
      dot: "bg-violet-400",
      hex: "#8B5CF6",
      pulse: false,
    };
  }

  // 1. Confirmado → verde esmeralda
  if (s.includes("confirmado")) {
    return {
      label: "Confirmado",
      className: EMERALD,
      dot: "bg-emerald-400",
      hex: "#10B981",
      pulse: false,
    };
  }

  // 2. Agendado → amarelo ouro
  if (s.includes("agendado")) {
    return { label: "Agendado", className: GOLD, dot: "bg-amber-400", hex: "#F59E0B", pulse: false };
  }

  // 5. Avaliação / Google → azul royal / ciano
  if (s.includes("avaliacao") || s.includes("google")) {
    return {
      label: "Avaliação Google",
      className: CYAN,
      dot: "bg-cyan-400",
      hex: "#22D3EE",
      pulse: false,
    };
  }

  // 6. Realizado → cinza platina / titânio fosco
  if (s.includes("realizado")) {
    return {
      label: "Realizado",
      className: PLATINUM,
      dot: "bg-slate-400",
      hex: "#94A3B8",
      pulse: false,
    };
  }

  if (s.includes("pendente") || s.includes("atendente")) {
    return {
      label: "Pendente Atendente",
      className: RUBY,
      dot: "bg-rose-500 dark:bg-rose-400",
      hex: "#E11D48",
      pulse: true,
    };
  }

  if (s.includes("cancelado")) {
    return {
      label: "Cancelado",
      className: CARBON,
      dot: "bg-zinc-400 dark:bg-zinc-600",
      hex: "#A1A1AA",
      pulse: false,
    };
  }

  return {
    label: titleCase(s),
    className: TITANIUM,
    dot: "bg-slate-500 dark:bg-zinc-500",
    hex: "#334155",
    pulse: false,
  };
}
