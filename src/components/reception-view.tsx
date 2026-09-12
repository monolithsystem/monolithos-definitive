import { useState, useMemo, useEffect } from "react";
import {
  RefreshCw,
  Users,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Stethoscope,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusStyle } from "@/lib/status-styles";
import { useAppointments } from "@/hooks/use-appointments";
import {
  SURFACE,
  CARD_SURFACE,
  VALUE_TEXT,
  LABEL_TEXT,
  isConfirmado,
  isFilaAtiva,
} from "@/lib/theme-classes";
import { EmptyState, EMPTY_VALUE, EMPTY_VALUE_CLASS } from "@/components/empty-state";

const EMPTY_TITLE = "Aguardando fluxo de registros ativos";
const EMPTY_SUBTITLE = "O motor de busca em tempo real está monitorando o sistema.";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function formatarDataPremium(data: Date): string {
  return `${DIAS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function safe(value: string | undefined | null): string {
  const v = (value ?? "").trim();
  return v || "-";
}

export function ReceptionView() {
  // Busca silenciosa em segundo plano a cada 10s (sem estados de carregamento).
  const { appointments, error, isEmptyButConnected, lastUpdate, fetchData } = useAppointments();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleRefresh = () => {
    setRefreshing(true);
    void fetchData();
    setTimeout(() => setRefreshing(false), 800);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) =>
      [a.nome, a.telefone, a.medico, a.dataHora, a.procedimento, a.status]
        .map((v) => (v ?? "").toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [appointments, search]);

  // Sem registros reais da planilha: cards e tabela entram em modo vazio.
  const semDados = appointments.length === 0;

  // Volume bruto total de linhas da planilha.
  const historicos = appointments.length;

  // Fila ativa: agendado + confirmado + pendente atendente + espera + aguardar.
  const filaAtiva = useMemo(
    () => appointments.filter((a) => isFilaAtiva(a.status)).length,
    [appointments],
  );

  const confirmados = useMemo(
    () => appointments.filter((a) => isConfirmado(a.status)).length,
    [appointments],
  );

  // Regra estrita da planilha: coluna K (Tentativas_Reativacao) — só conta se > 0.
  const emReativacao = useMemo(
    () => appointments.filter((a) => Number(a.tentativasReativacao ?? 0) > 0).length,
    [appointments],
  );

  const EMPTY_CONNECTED_TITLE = "Agenda livre de registros ativos";
  const EMPTY_CONNECTED_SUBTITLE =
    "Nenhum atendimento foi lançado no banco de dados para este período.";

  // Auxiliar: decide o valor dos cards conforme o estado de conexão.
  const cardValue = (real: number) => {
    if (error) return EMPTY_VALUE;
    if (isEmptyButConnected) return 0;
    return real;
  };

  const cardEmpty = error || (semDados && !isEmptyButConnected);

  return (
    <div className="mx-auto max-w-7xl animate-in px-4 pb-16 pt-28 fade-in slide-in-from-bottom-4 duration-500 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Recepção
          </h1>
          <p className="mt-1.5 text-sm font-light tracking-wide text-muted-foreground">
            {formatarDataPremium(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {mounted ? `Atualizado às ${lastUpdate.toLocaleTimeString("pt-BR")}` : "\u00A0"}
          </span>
          <button
            onClick={handleRefresh}
            className={cn(
              "group flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-300 hover:border-amber-500/25 dark:text-foreground",
              SURFACE,
            )}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 text-amber-600 transition-transform duration-500 dark:text-gold",
                refreshing ? "animate-spin-smooth" : "group-hover:rotate-180",
              )}
              strokeWidth={1.75}
            />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* CARD 1 — Platina / Titânio Executivo */}
        <StatCard
          icon={<Users className="h-5 w-5" strokeWidth={1.5} />}
          label="Atendimentos Históricos"
          value={semDados ? EMPTY_VALUE : historicos}
          empty={semDados}
          accent="border-l-4 border-l-slate-400/50 dark:border-l-slate-400"
          iconColor="text-slate-500 dark:text-slate-400"
        />
        {/* CARD 2 — Dourado Metálico de Luxo (fila ativa) */}
        <StatCard
          icon={<Calendar className="h-5 w-5" strokeWidth={1.5} />}
          label="Com Horário Marcado"
          value={semDados ? EMPTY_VALUE : filaAtiva}
          empty={semDados}
          accent="border-l-4 border-l-amber-500/50 dark:border-l-amber-500"
          iconColor="text-amber-600 dark:text-amber-500"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />}
          label="Confirmados"
          value={semDados ? EMPTY_VALUE : confirmados}
          empty={semDados}
          accent="border-l-4 border-l-emerald-600/50 dark:border-l-emerald-600"
          iconColor="text-emerald-600 dark:text-emerald-500"
        />
        {/* CARD 4 — Roxo / Violeta nobre (reativação) */}
        <StatCard
          icon={<RefreshCw className="h-5 w-5" strokeWidth={1.5} />}
          label="Pacientes em Reativação"
          value={semDados ? EMPTY_VALUE : emReativacao}
          empty={semDados}
          accent="border-l-4 border-l-purple-600/50 dark:border-l-purple-500"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-300"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone, médico, data ou procedimento..."
            className="h-10 w-full rounded-full border border-amber-500/10 bg-black/50 pl-10 pr-10 text-sm text-foreground backdrop-blur-lg transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/20 light:border-amber-600/15 light:bg-white light:text-zinc-900 light:backdrop-blur-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
        {search && (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className={cn("mt-6 overflow-hidden", SURFACE)}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 light:border-slate-200">
                <Th>Nº</Th>
                <Th>Paciente</Th>
                <Th>Status</Th>
                <Th>Data e Hora</Th>
                <Th>Médico Responsável</Th>
                <Th>Procedimento</Th>
                <Th>Reativação</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10">
                    {search ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum paciente encontrado para esta busca
                      </p>
                    ) : (
                      <EmptyState title={EMPTY_TITLE} subtitle={EMPTY_SUBTITLE} />
                    )}
                  </td>
                </tr>
              )}

              {filtered.map((apt, idx) => {
                const style = getStatusStyle(apt.status);
                const telefone = safe(apt.telefone);
                const medico = safe(apt.medico);
                return (
                  <tr
                    key={`${apt.telefone}-${apt.nome}-${idx}`}
                    className="group border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03] light:border-slate-200 light:hover:bg-slate-50"
                  >
                    <td className="p-4 text-xs font-medium text-muted-foreground">{idx + 1}</td>
                    <td className="p-4">
                      <div className={cn("font-medium", VALUE_TEXT)}>{safe(apt.nome)}</div>
                      {telefone !== "-" && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3 text-emerald-400/70" strokeWidth={1.5} />
                          <span>{telefone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
                          style.className,
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            style.dot,
                            style.pulse && "animate-pulse",
                          )}
                        />
                        {style.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-4 text-muted-foreground">
                      {safe(apt.dataHora)}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {medico !== "-" ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Stethoscope
                            className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                            strokeWidth={1.75}
                          />
                          {medico}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{medico}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap p-4 text-muted-foreground">
                      {safe(apt.procedimento)}
                    </td>
                    <td className="whitespace-nowrap p-4 text-muted-foreground">
                      {Math.max(0, apt.tentativasReativacao ?? 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </th>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  iconColor,
  empty = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
  iconColor: string;
  empty?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative animate-fade-in overflow-hidden p-5 transition-all duration-500",
        CARD_SURFACE,
        accent,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              "text-[11px] font-medium uppercase tracking-[0.14em]",
              LABEL_TEXT,
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-serif text-3xl font-semibold",
              empty ? EMPTY_VALUE_CLASS : VALUE_TEXT,
            )}
          >
            {value}
          </p>
        </div>
        <div className={cn("shrink-0", iconColor)}>{icon}</div>
      </div>
    </div>
  );
}
