import { useState, useCallback, useEffect, useRef } from "react";
import { parseCSV, mockAppointments, type Appointment } from "@/lib/sheets";

function serialize(appts: Appointment[]): string {
  return appts
    .map(
      (a) =>
        `${a.telefone}|${a.nome}|${a.status}|${a.dataHora}|${a.medico}|${a.procedimento}|${a.tentativasReativacao}|${a.campanhaReativacao}`,
    )
    .join("||");
}

/**
 * Busca os dados da planilha a cada 10 segundos de forma 100% silenciosa:
 * nenhum estado de carregamento é alternado após a primeira carga, e os dados
 * antigos permanecem intactos até que um conjunto novo os substitua.
 */
export function useAppointments(enabled = true) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [lastUpdate, setLastUpdate] = useState<Date>(() => new Date());
  const [error, setError] = useState<string | null>(null);

  const prevSignature = useRef<string>(serialize(mockAppointments));
  const inFlight = useRef(false);

  const fetchData = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const url = import.meta.env["VITE_SHEETS_URL"] as string | undefined;
      if (!url) {
        setLastUpdate(new Date());
        return;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        const sig = serialize(parsed);
        if (sig !== prevSignature.current) {
          prevSignature.current = sig;
          // Substituição instantânea, sem limpar a tela antes.
          setAppointments(parsed);
        }
      }
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      // Falha silenciosa: mantém os dados anteriores em tela.
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchData();
    const id = setInterval(() => void fetchData(), 10000);
    return () => clearInterval(id);
  }, [enabled, fetchData]);

  return { appointments, error, lastUpdate, fetchData };
}
