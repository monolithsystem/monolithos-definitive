import { useState, useEffect } from "react";
import { ClipboardList, BarChart3, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export type TabValue = "recepcao" | "diretor";

interface TopNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  directorUnlocked: boolean;
}

export function TopNav({ activeTab, onTabChange, directorUnlocked }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // O dourado definitivo só aparece no painel ativo após o desbloqueio.
  const diretorAtivo = activeTab === "diretor";
  const diretorPremium = diretorAtivo && directorUnlocked;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gold/10 bg-black/60 backdrop-blur-xl light:border-amber-600/15 light:bg-white/80"
          : "border-b border-white/5 bg-transparent light:border-slate-200/60",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2.5 py-3 sm:h-16 sm:flex-row sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex items-center gap-2.5">
            <svg aria-label="MonolithOS" className="h-8 w-8 shrink-0" viewBox="0 0 96 96" role="img">
              <path d="M25 88 31 27 48 12 65 27 71 88Z" fill="#D4AF37" />
              <path d="M51 20 54 22 54 88 51 88Z" fill="#0A0A0A" />
              <path d="M57 27 60 29 60 72 57 65Z" fill="#0A0A0A" />
              <path d="M63 32 66 34 66 67 63 59Z" fill="#0A0A0A" />
              <path d="M68 37 70 39 70 63 68 56Z" fill="#0A0A0A" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base font-semibold tracking-tight text-foreground">
                MonolithOS
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Medical Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-full border border-gold/10 bg-black/50 p-1 backdrop-blur-lg light:border-amber-600/15 light:bg-white light:backdrop-blur-none">
              <NavButton
                active={activeTab === "recepcao"}
                premium={false}
                onClick={() => onTabChange("recepcao")}
                icon={<ClipboardList className="h-4 w-4" strokeWidth={1.5} />}
                label="Recepção"
              />
              <NavButton
                active={diretorAtivo}
                premium={diretorPremium}
                onClick={() => onTabChange("diretor")}
                icon={
                  directorUnlocked ? (
                    <BarChart3 className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Lock className="h-4 w-4" strokeWidth={1.5} />
                  )
                }
                label="Painel do Diretor"
              />
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButton({
  active,
  premium,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  premium: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 sm:px-4 sm:text-sm",
        premium
          ? "border border-amber-500/30 bg-gradient-gold text-black shadow-glow-gold"
          : active
            ? "border border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:backdrop-blur-sm"
            : "border border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
