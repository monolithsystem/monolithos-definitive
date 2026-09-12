import { useState, useCallback, useEffect, useRef } from "react";
import { parseCSV, type Appointment } from "@/lib/sheets";

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
 *
 * Estados de vazio:
 * - error = true  → falha de rede/link inválido (sem conexão).
 * - isEmptyButConnected = true → conectado, mas planilha não tem linhas válidas.
 */
export function useAppointments(enabled = true) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(() => new Date());
  const [error, setError] = useState<boolean>(false);
  const [isEmptyButConnected, setIsEmptyButConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const prevSignature = useRef<string>(serialize([]));
  const inFlight = useRef(false);

  const fetchData = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const url = import.meta.env["VITE_SHEETS_URL"] as string | undefined;
      if (!url) {
        setError(true);
        setIsEmptyButConnected(false);
        setAppointments([]);
        setLastUpdate(new Date());
        setLoading(false);
        return;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        // Conexão OK, mas planilha vazia.
        setError(false);
        setIsEmptyButConnected(true);
        setAppointments([]);
      } else {
        const sig = serialize(parsed);
        if (sig !== prevSignature.current) {
          prevSignature.current = sig;
          // Substituição instantânea, sem limpar a tela antes.
          setAppointments(parsed);
        }
        setError(false);
        setIsEmptyButConnected(false);
      }

      setLastUpdate(new Date());
    } catch (err) {
      // Falha silenciosa: mantém os dados anteriores em tela.
      setError(true);
      setIsEmptyButConnected(false);
      setAppointments([]);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchData();
    const id = setInterval(() => void fetchData(), 10000);
    return () => clearInterval(id);
  }, [enabled, fetchData]);

  return { appointments, error, isEmptyButConnected, loading, lastUpdate, fetchData };
}
