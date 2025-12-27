import { useEffect, useState } from "react";
import { ChessEngine } from "../types/chess";
import { invoke } from "@tauri-apps/api/core";

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

        console.log("Calling get_installed_engines...");
        const result = await invoke<GetEnginesResponse>(
          "get_installed_engines"
        );
        console.log("get_installed_engines result:", result);
        console.log("result.success:", result.success);
        console.log("result.engines:", result.engines);
        console.log("result.engines length:", result.engines?.length);
        console.log("result.engines full:", JSON.stringify(result.engines));

        if (result.success && result.engines && result.engines.length > 0) {
          setEngines(result.engines);
          setError(null);
        } else {
          setError(result.error || "No engines found");
          setEngines([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error when fetching engines";
        console.error("Full error:", err);
        console.error("Error message:", errorMessage);
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
