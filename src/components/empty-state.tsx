import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  className?: string;
}

/** Aviso executivo em vidro fosco para "sem conexão ou sem registros". */
export function EmptyState({ title, subtitle, className }: EmptyStateProps) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center p-4", className)}>
      <div className="max-w-sm rounded-xl border border-zinc-200 bg-slate-50/80 px-6 py-7 text-center backdrop-blur-md dark:border-white/5 dark:bg-black/40">
        <p className="font-serif text-base font-semibold text-amber-700/80 dark:text-amber-500/60">
          {title}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
      </div>
    </div>
  );
}

export const EMPTY_VALUE = "--";

/** Números indisponíveis: dourado fosco nos dois temas. */
export const EMPTY_VALUE_CLASS = "text-amber-700/80 dark:text-amber-500/60";
