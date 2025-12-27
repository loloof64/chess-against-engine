import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { invoke } from "@tauri-apps/api/core";

interface AndroidProcess {
  path: string;
  id: string;
}

interface ProcessResponse {
  success: boolean;
  message: string;
  process_id?: string;
}

type OutputListener = (output: string) => void;

interface AndroidEngineProcessContextType {
  engineProcess: AndroidProcess | null;
  processOutput: string;
  startEngineProcess: (path: string) => Promise<void>;
  stopEngineProcess: (processId?: string) => Promise<void>;
  sendCommandToEngine: (command: string) => Promise<void>;
  addOutputListener: (listener: OutputListener) => () => void;
}

// Module-level state for output handling
const outputListeners = new Set<OutputListener>();
let currentProcessOutput = "";

// Global function that can be called from Kotlin/Android bridge
function emitEngineOutput(output: string) {
  currentProcessOutput += output;
  outputListeners.forEach((listener) => {
    listener(output);
  });
}

// Expose globally for Android bridge to call
(window as any).__engineEmitOutput = emitEngineOutput;

// Call Rust to flush any buffered outputs from Android
import("@tauri-apps/api/core").then(({ invoke }) => {
  invoke("flush_buffered_engine_output")
    .then(() => {})
    .catch((e) => {
      console.error(
        "Note: flush_buffered_engine_output not available or errored:",
        e
      );
    });
});

const AndroidEngineProcessContext = createContext<
  AndroidEngineProcessContextType | undefined
>(undefined);

export function EngineProcessProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage to survive navigation
  const [engineProcess, setEngineProcess] = useState<AndroidProcess | null>(
    () => {
      try {
        const saved = localStorage.getItem("engineProcess");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
  );
  const [processOutput, setProcessOutput] = useState<string>("");

  // Persist engineProcess to localStorage whenever it changes
  useEffect(() => {
    if (engineProcess) {
      localStorage.setItem("engineProcess", JSON.stringify(engineProcess));
    } else {
      localStorage.removeItem("engineProcess");
    }
  }, [engineProcess]);

  // Validate engine still exists when app resumes
  useEffect(() => {
    if (!engineProcess) return;

    const validateEngine = async () => {
      try {
        const result = await invoke<any>("get_installed_engines");
        if (result.success && result.engines) {
          const engineStillExists = result.engines.some(
            (e: any) => e.path === engineProcess.path
          );
          if (!engineStillExists) {
            console.warn(
              `Engine at ${engineProcess.path} is no longer installed, clearing state`
            );
            setEngineProcess(null);
            currentProcessOutput = "";
          }
        }
      } catch (error) {
        console.error("Error validating engine:", error);
      }
    };

    validateEngine();
  }, []); // Run once on mount

  // Sync module-level output to React state
  useEffect(() => {
    const listener = (output: string) => {
      setProcessOutput((prev) => prev + output);
    };

    outputListeners.add(listener);
    return () => {
      outputListeners.delete(listener);

    };
  }, []);

  // Clean up engine process when component unmounts (app closes)
  useEffect(() => {
    return () => {
      if (engineProcess) {
        invoke("stop_engine_process", { processId: engineProcess.id }).catch(
          (e) => console.error("Error stopping engine on unmount:", e)
        );
      }
    };
  }, [engineProcess]);

  const startEngineProcess = useCallback(async (path: string) => {
    if (path === "") return;

    const processId = `engine_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    try {
      // Reset output for new process
      currentProcessOutput = "";
      setProcessOutput("");
      outputListeners.forEach((listener) => listener("")); // Clear listeners

      const response = await invoke<ProcessResponse>("start_engine_process", {
        path,
        processId,
      });

      if (response.success) {
        const newProcess: AndroidProcess = {
          path,
          id: processId,
        };

        setEngineProcess(newProcess);
      } else {
        console.error(`Failed to start engine: ${response.message}`);
      }
    } catch (error) {
      console.error("Error starting engine process:", error);
    }
  }, []);

  const stopEngineProcess = useCallback(
    async (processId?: string) => {
      const idToStop = processId || engineProcess?.id;
      if (!idToStop) {
        console.warn("No engine process ID to stop");
        return;
      }

      try {
        const response = await invoke<ProcessResponse>("stop_engine_process", {
          processId: idToStop,
        });

        if (response.success) {
          console.log(`Engine process stopped`);
          setEngineProcess(null);
          currentProcessOutput = "";
          setProcessOutput("");
        } else {
          console.error(`Failed to stop engine: ${response.message}`);
        }
      } catch (error) {
        console.error("Error stopping engine process:", error);
      }
    },
    [engineProcess]
  );

  const sendCommandToEngine = useCallback(
    async (command: string) => {
      if (!engineProcess) {
        console.warn("No engine process running, cannot send command");
        return;
      }

      try {
        const response = await invoke<ProcessResponse>("send_engine_command", {
          processId: engineProcess.id,
          command,
        });

        if (!response.success) {
          console.error(`Failed to send command: ${response.message}`);
        }
      } catch (error) {
        console.error("Error sending command to engine:", error);
      }
    },
    [engineProcess]
  );

  const addOutputListener = useCallback((listener: OutputListener) => {
    outputListeners.add(listener);

    // Send any accumulated output to the new listener immediately
    if (currentProcessOutput.length > 0) {
      listener(currentProcessOutput);
    }

    // Return unsubscribe function
    return () => {
      outputListeners.delete(listener);
    };
  }, []);

  return (
    <AndroidEngineProcessContext.Provider
      value={{
        engineProcess,
        processOutput,
        startEngineProcess,
        stopEngineProcess,
        sendCommandToEngine,
        addOutputListener,
      }}
    >
      {children}
    </AndroidEngineProcessContext.Provider>
  );
}

export function useEngineProcess() {
  const context = useContext(AndroidEngineProcessContext);
  if (context === undefined) {
    throw new Error(
      "useEngineProcess must be used within EngineProcessProvider"
    );
  }
  return context;
}
