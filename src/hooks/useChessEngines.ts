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

        console.log("Calling test_command...");
        const testResult = await invoke<string>("test_command");
        console.log("test_command result:", testResult);

        console.log("Calling getInstalledEngines...");
        const result = await invoke<GetEnginesResponse>(
          "get_installed_engines"
        );
        console.log("getInstalledEngines result:", result);

        if (result.success && result.engines) {
          setEngines(result.engines);
          setError(null);
        } else {
          setError(result.error || "Unknown error");
          setEngines([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error when fetching engines";
        console.error("Error:", errorMessage);
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
