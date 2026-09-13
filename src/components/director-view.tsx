import { useState, useRef, useEffect, useMemo } from "react";
import {
  Lock,
  Unlock,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useAppointments } from "@/hooks/use-appointments";
import {
  SURFACE,
  CARD_SURFACE,
  VALUE_TEXT,
  LABEL_TEXT,
  tooltipStyles,
  isCancelado,
  isConfirmado,
  isEmTransicao,
  isFilaAtiva,
  isPendenteAtendente,
} from "@/lib/theme-classes";
import { EmptyState, EMPTY_VALUE, EMPTY_VALUE_CLASS } from "@/components/empty-state";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DirectorViewProps {
  unlocked: boolean;
  onUnlock: (value: boolean) => void;
}

const EMPTY_TITLE = "Painel estratégico aguardando sincronização";
const EMPTY_SUBTITLE =
  "Insira novas movimentações de pacientes para projetar os indicadores de procedimentos e taxas de confirmação.";

export function DirectorView({ unlocked, onUnlock }: DirectorViewProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [fading, setFading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetPin = (import.meta.env["VITE_DIRETOR_PIN"] as string | undefined) || "2008";
  const pinLength = targetPin.length;

  const handleUnlock = () => {
    if (isUnlocking) return;
    if (pin === targetPin) {
      setError(false);
      setIsUnlocking(true);
      // Primeiro revela os cadeados abertos; depois inicia a saída cinematográfica.
      fadeTimerRef.current = setTimeout(() => {
        setFading(true);
        unlockTimerRef.current = setTimeout(() => {
          onUnlock(true);
          setIsUnlocking(false);
          setFading(false);
        }, 1100);
      }, 450);
    } else {
      setError(true);
      setPin("");
      inputRef.current?.focus();
      setTimeout(() => setError(false), 2500);
    }
  };

  // Validação 100% automática ao digitar o último número do código.
  useEffect(() => {
    if (unlocked || isUnlocking) return;
    if (pinLength > 0 && pin.length >= pinLength && /^\d+$/.test(pin)) {
      handleUnlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, pinLength, unlocked, isUnlocking]);

  useEffect(
    () => () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!unlocked) {
      setPin("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [unlocked]);

  if (unlocked) {
    return (
      <DirectorDashboard
        onLogout={() => {
          onUnlock(false);
          setPin("");
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center px-4 pt-16 transition-opacity duration-1000 ease-in-out",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="w-full max-w-md animate-fade-in-up">
        <div className={cn("relative overflow-hidden p-8 rounded-2xl", SURFACE)}>
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-gold opacity-[0.08] blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 transition-all duration-500",
                isUnlocking
                  ? "animate-bounce rotate-12 scale-110 border-blue-500 bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  : "text-gold",
              )}
            >
              {isUnlocking ? (
                <Unlock className="h-10 w-10 text-blue-400" strokeWidth={1.25} />
              ) : (
                <Lock className="h-10 w-10" strokeWidth={1.25} />
              )}
            </div>

            <h2 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-foreground">
              Área Restrita
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Insira o código de acesso para visualizar o painel executivo
            </p>

            <div className="mt-8 w-full">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  disabled={isUnlocking}
                  placeholder={"•".repeat(pinLength || 4)}
                  inputMode="numeric"
                  maxLength={pinLength || 8}
                  autoFocus
                  className={cn(
                    "h-14 w-full rounded-xl border bg-black/60 px-4 pr-12 text-center text-2xl font-semibold tracking-[0.4em] text-white transition-all duration-300 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 light:bg-white light:text-zinc-900",
                    error
                      ? "border-rose-700/50 focus:ring-rose-700/40"
                      : "border-amber-500/15 focus:border-amber-500/40 focus:ring-amber-500/30",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3 flex animate-fade-in-up items-center justify-center gap-2 text-sm text-rose-400">
                  <AlertCircle className="h-4 w-4" strokeWidth={1.5} />
                  <span>Código incorreto. Tente novamente.</span>
                </div>
              )}

              <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className={cn(
                  "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-500 active:scale-[0.98]",
                  isUnlocking
                    ? "bg-blue-600 text-white shadow-[0_0_24px_-4px_rgba(59,130,246,0.7)]"
                    : "bg-gradient-gold text-black hover:shadow-glow-gold",
                )}
              >
                {isUnlocking ? (
                  <>
                    <Unlock className="h-4 w-4" strokeWidth={1.75} />
                    Acesso Concedido...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" strokeWidth={1.75} />
                    Desbloquear
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground/60">
              Acesso exclusivo para direção médica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectorDashboard({ onLogout }: { onLogout: () => void }) {
  const { isLight } = useTheme();
  const { appointments, error, isEmptyButConnected } = useAppointments();
  const tip = tooltipStyles(isLight);

  const confirmados = useMemo(
    () => appointments.filter((a) => isConfirmado(a.status)).length,
    [appointments],
  );
  const emTransicao = useMemo(
    () =>
      appointments.filter((a) => {
        const status = (a.status ?? "")
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (isCancelado(status)) return false;
        return (
          status.includes("agendado") ||
          status.includes("pendente atendente") ||
          (status.includes("espera") && status.includes("confirmacao")) ||
          status.includes("reagendamento")
        );
      }).length,
    [appointments],
  );
  // Estrito: conta APENAS linhas cujo status contém 'pendente atendente'.
  const pendenciasConfirmacao = useMemo(
    () => appointments.filter((a) => isPendenteAtendente(a.status)).length,
    [appointments],
  );
  // Fila ativa: agendado + confirmado + pendente atendente + espera + aguardar.
  const totalAgendados = useMemo(
    () => appointments.filter((a) => isFilaAtiva(a.status)).length,
    [appointments],
  );
  const campanhasReativacao = useMemo(
    () =>
      appointments.filter(
        (a) => !isCancelado(a.status) && Number(a.tentativasReativacao ?? 0) > 0,
      ).length,
    [appointments],
  );
  const semDados = appointments.length === 0;

  const taxaConfirmacao = useMemo(() => {
    if (error) return EMPTY_VALUE;
    if (isEmptyButConnected) return "0%";
    if (totalAgendados === 0) return "0%";
    return `${Math.round((confirmados / totalAgendados) * 100)}%`;
  }, [confirmados, totalAgendados, error, isEmptyButConnected]);

  // Auxiliar: decide o valor dos cards conforme o estado de conexão.
  const cardValue = (real: number) => {
    if (error) return EMPTY_VALUE;
    if (isEmptyButConnected) return 0;
    return real;
  };

  const cardEmpty = error || (semDados && !isEmptyButConnected);

  // Coluna H (Procedimento): agrupamento real e dinâmico da planilha.
  const procedureData = useMemo(() => {
    const map = new Map<string, { name: string; value: number }>();
    for (const a of appointments) {
      if (isCancelado(a.status)) continue;
      const raw = (a.procedimento ?? "").trim();
      if (!raw) continue;
      const key = raw.toLowerCase().trim();
      const entry = map.get(key);
      if (entry) entry.value += 1;
      else map.set(key, { name: raw, value: 1 });
    }
    return [...map.values()].sort((a, b) => b.value - a.value);
  }, [appointments]);

  const semProcedimentos = procedureData.length === 0;
  const semStatus = confirmados + emTransicao === 0;

  const EMPTY_CONNECTED_TITLE = "Monitoramento estratégico em espera";
  const EMPTY_CONNECTED_SUBTITLE =
    "Conexão estável. Insira novas movimentações de pacientes para projetar os indicadores de procedimentos e taxas de confirmação.";

  const statusData = useMemo(
    () => [
      { name: "Confirmados", value: confirmados, hex: "#F59E0B" },
      { name: "Em Transição", value: emTransicao, hex: isLight ? "#94A3B8" : "#64748B" },
    ],
    [confirmados, emTransicao, isLight],
  );

  return (
    <div className="mx-auto max-w-7xl animate-in px-4 pb-16 pt-28 fade-in slide-in-from-bottom-4 duration-500 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Painel do Diretor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas executivas consolidadas da clínica
          </p>
        </div>
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground",
            SURFACE,
          )}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Bloquear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard
          icon={<Users className="h-5 w-5" strokeWidth={1.5} />}
          label="Total Agendados"
          value={cardValue(totalAgendados)}
          empty={cardEmpty}
          accent="border-l-4 border-l-amber-500/60 dark:border-l-amber-500"
          iconColor="text-amber-500"
        />
        <SummaryCard
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
          label="Taxa de Confirmação"
          value={taxaConfirmacao}
          empty={cardEmpty}
          accent="border-l-4 border-l-emerald-600/60 dark:border-l-emerald-600"
          iconColor="text-emerald-600 dark:text-emerald-500"
        />
        <SummaryCard
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.5} />}
          label="Pendências de Confirmação"
          value={cardValue(pendenciasConfirmacao)}
          empty={cardEmpty}
          accent="border-l-4 border-l-rose-600/60 dark:border-l-rose-600"
          iconColor="text-rose-600 dark:text-rose-500"
        />
        <SummaryCard
          icon={<RefreshCw className="h-5 w-5" strokeWidth={1.5} />}
          label="Campanhas de Reativação"
          value={cardValue(campanhasReativacao)}
          empty={cardEmpty}
          accent="border-l-4 border-l-purple-600/60 dark:border-l-purple-500"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Procedimentos mais Procurados"
          subtitle="Volume por procedimento no período"
        >
          <div className="mt-4 h-[300px]">
            {semProcedimentos ? (
              <EmptyState
                title={isEmptyButConnected ? EMPTY_CONNECTED_TITLE : EMPTY_TITLE}
                subtitle={isEmptyButConnected ? EMPTY_CONNECTED_SUBTITLE : EMPTY_SUBTITLE}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={procedureData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke={isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.05)"}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: isLight ? "#475569" : "#94A3B8" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: isLight ? "#475569" : "#94A3B8" }}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(212,175,55,0.2)" }}
                    contentStyle={tip.contentStyle}
                    labelStyle={tip.labelStyle}
                    itemStyle={tip.itemStyle}
                    wrapperStyle={tip.wrapperStyle}
                    allowEscapeViewBox={tip.allowEscapeViewBox}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Agendamentos"
                    stroke="#D4AF37"
                    strokeWidth={1}
                    fill="url(#goldArea)"
                    dot={false}
                    activeDot={{ r: 3, fill: "#D4AF37", stroke: "none" }}
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Status dos Agendamentos" subtitle="Distribuição de confirmações">
          <div className="mt-4 h-[300px]">
            {semStatus ? (
              <EmptyState
                title={isEmptyButConnected ? EMPTY_CONNECTED_TITLE : EMPTY_TITLE}
                subtitle={isEmptyButConnected ? EMPTY_CONNECTED_SUBTITLE : EMPTY_SUBTITLE}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={82}
                    outerRadius={96}
                    paddingAngle={2}
                    stroke="none"
                    animationDuration={900}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.hex} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={false}
                    wrapperStyle={tip.wrapperStyle}
                    allowEscapeViewBox={tip.allowEscapeViewBox}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      const name = String(item?.name ?? "");
                      const isTransicao = name.toLowerCase().includes("transi");
                      const color = isTransicao ? "#64748B" : isLight ? "#B45309" : "#F59E0B";
                      return (
                        <div style={tip.contentStyle}>
                          <span style={{ ...tip.itemStyle, color }}>
                            {name}: {item?.value}
                          </span>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    content={() => (
                      <div className="flex items-center justify-center gap-6 pt-2">
                        {statusData.map((entry) => (
                          <span key={entry.name} className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: entry.hex }}
                            />
                            <span className="text-[11px] font-medium text-zinc-900 dark:text-white">
                              {entry.name}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("animate-fade-in p-6", SURFACE)}>
      <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}

function SummaryCard({
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
