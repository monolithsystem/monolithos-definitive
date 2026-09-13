export type StatusStyle = {
  label: string;
  bg: string;
  text: string;
  border: string;
  hex: string;
  pulse: boolean;
};

/** Paleta estrita de alta costura: fundos translúcidos e bordas delicadas. */
const EMERALD = {
  bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
  text: "text-emerald-800 dark:text-emerald-400",
  border: "border-emerald-500/30 dark:border-emerald-500/20",
  hex: "#059669",
};
const GOLD = {
  bg: "bg-amber-500/10 dark:bg-amber-500/5",
  text: "text-amber-800 dark:text-amber-400",
  border: "border-amber-500/30 dark:border-amber-500/20",
  hex: "#d97706",
};
const BLUE = {
  bg: "bg-blue-500/10 dark:bg-blue-500/5",
  text: "text-blue-700 dark:text-blue-400",
  border: "border-blue-500/30 dark:border-blue-500/20",
  hex: "#2563eb",
};
const PURPLE = {
  bg: "bg-purple-500/10 dark:bg-purple-500/5",
  text: "text-purple-800 dark:text-purple-400",
  border: "border-purple-500/30 dark:border-purple-500/20",
  hex: "#9333ea",
};
const ROSE = {
  bg: "bg-rose-500/10 dark:bg-rose-500/5",
  text: "text-rose-800 dark:text-rose-400",
  border: "border-rose-500/30 dark:border-rose-500/20",
  hex: "#dc2626",
};
const ZINC = {
  bg: "bg-zinc-500/10 dark:bg-zinc-500/5",
  text: "text-zinc-800 dark:text-zinc-400",
  border: "border-zinc-500/30 dark:border-zinc-500/20",
  hex: "#71717a",
};

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
      ...ROSE,
      pulse: true,
    };
  }

  // Esperas e reagendamentos → azul clínico suave.
  if (
    (s.includes("espera") && s.includes("confirmacao")) ||
    s.includes("reagendamento")
  ) {
    return {
      label: s.includes("reagendamento") ? "À Espera Reagendamento" : "À Espera Confirmação",
      ...BLUE,
      pulse: false,
    };
  }

  // Confirmado e realizado → verde esmeralda.
  if (s.includes("confirmado")) {
    return {
      label: "Confirmado",
      ...EMERALD,
      pulse: false,
    };
  }

  if (s.includes("realizado")) {
    return {
      label: "Realizado",
      ...EMERALD,
      pulse: false,
    };
  }

  // Agendado → dourado premium.
  if (s.includes("agendado")) {
    return { label: "Agendado", ...GOLD, pulse: false };
  }

  // Avaliação / Google → roxo.
  if (s.includes("avaliacao") || s.includes("google")) {
    return {
      label: "Avaliação Google",
      ...PURPLE,
      pulse: false,
    };
  }

  if (s.includes("pendente") || s.includes("atendente")) {
    return {
      label: "Pendente Atendente",
      ...ROSE,
      pulse: true,
    };
  }

  if (s.includes("cancelado")) {
    return {
      label: "Cancelado",
      ...ZINC,
      pulse: false,
    };
  }

  return {
    label: titleCase(s),
    ...ZINC,
    pulse: false,
  };
}
