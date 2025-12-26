import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ChessEngine } from "../types/chess";

interface GetEnginesResponse {
  success: boolean;
  engines?: ChessEngine[];
  error?: string;
}

export function useChessEngines() {
  const [engines, setEngines] = useState<ChessEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        setLoading(true);
        const result = await invoke<GetEnginesResponse>(
          "plugin:chess_engines|getInstalledEngines"
        );

        if (result.success && result.engines) {
          setEngines(result.engines);
          setError(null);
        } else {
          setError(result.error || "Erreur inconnue");
          setEngines([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des moteurs";
        setError(errorMessage);
        setEngines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEngines();
  }, []);

  return { engines, loading, error };
}
