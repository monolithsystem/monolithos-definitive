import { MoonStar, SunDim } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { isLight, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
      className={cn(
        "group relative h-7 w-14 shrink-0 rounded-full border transition-all duration-500 active:scale-95",
        isLight
          ? "border-amber-600/20 bg-white/80 shadow-sm shadow-slate-200/60"
          : "border-amber-500/10 bg-black/60 backdrop-blur-lg",
      )}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5">
        <SunDim
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-300",
            isLight ? "text-amber-600 opacity-100" : "opacity-0",
          )}
          strokeWidth={1.5}
        />
        <MoonStar
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-300",
            isLight ? "opacity-0" : "text-amber-400 opacity-100",
          )}
          strokeWidth={1.5}
        />
      </span>

      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-gradient-gold shadow-glow-gold transition-transform duration-500 ease-out group-active:rotate-45 group-active:scale-90",
          isLight ? "left-1 translate-x-0" : "left-1 translate-x-7",
        )}
      />
    </button>
  );
}
