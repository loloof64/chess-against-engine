import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { invoke } from "@tauri-apps/api/core";

interface DesktopProcess {
  id: string;
}

interface ProcessResponse {
  success: boolean;
  message: string;
  process_id?: string;
}

interface EngineOutputResponse {
  success: boolean;
  outputs: string[];
}

type OutputListener = (output: string) => void;

interface DesktopEngineProcessContextType {
  engineProcess: DesktopProcess | null;
  processOutput: string;
  startEngineProcess: () => Promise<void>;
  stopEngineProcess: (processId?: string) => Promise<void>;
  sendCommandToEngine: (command: string) => Promise<void>;
  addOutputListener: (listener: OutputListener) => () => void;
}

// Module-level state for output handling
const outputListeners = new Set<OutputListener>();
let currentProcessOutput = "";

// Clean up listener (no-op since we use polling)
function cleanupEngineOutputListener() {
  // Polling doesn't need cleanup
}

const DesktopEngineProcessContext = createContext<
  DesktopEngineProcessContextType | undefined
>(undefined);

export function DesktopEngineProcessProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize with no process
  const [engineProcess, setEngineProcess] = useState<DesktopProcess | null>(
    null
  );
  const [processOutput, setProcessOutput] = useState<string>("");
  const hasStartedRef = useRef(false); // Track if we've already started
  const currentProcessIdRef = useRef<string | null>(null); // Track current process ID for cleanup

  // Set up event listener on mount
  useEffect(() => {
    return () => {
      cleanupEngineOutputListener();
    };
  }, []);

  // Auto-start engine on mount (desktop only) - guard against double-mount with ref
  useEffect(() => {
    if (hasStartedRef.current) return; // Already attempted to start
    hasStartedRef.current = true;

    const processId = `engine_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const autoStartEngine = async () => {
      try {
        const response = await invoke<ProcessResponse>("start_engine_process", {
          path: "",
          processId,
        });

        if (response.success) {
          currentProcessIdRef.current = processId;
          setEngineProcess({ id: processId });
        }
      } catch (error) {
        console.error("Error auto-starting engine:", error);
      }
    };

    autoStartEngine();
  }, []); // Empty dependency - only run once on mount

  // Clean up engine process when component unmounts (app closes) - use ref to avoid loop
  useEffect(() => {
    return () => {
      if (currentProcessIdRef.current) {
        // Use synchronous approach for cleanup on unmount
        const processId = currentProcessIdRef.current;
        console.log("Stopping engine process on unmount:", processId);

        invoke("stop_engine_process", {
          processId,
        }).catch((e) => console.error("Error stopping engine on unmount:", e));
      }
    };
  }, []); // Empty dependency - only run cleanup on unmount

  // Poll for buffered engine output periodically
  useEffect(() => {
    if (!engineProcess) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await invoke<EngineOutputResponse>(
          "get_buffered_engine_output",
          { processId: engineProcess.id }
        );

        if (response.success && response.outputs.length > 0) {
          response.outputs.forEach((output) => {
            currentProcessOutput += output + "\n";
            outputListeners.forEach((listener) => {
              listener(output);
            });
          });
        }
      } catch (error) {
        // Silently ignore polling errors
      }
    }, 100); // Poll every 100ms for output

    return () => clearInterval(pollInterval);
  }, [engineProcess]);

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

  const startEngineProcess = useCallback(async () => {
    const processId = `engine_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    try {
      // Reset output for new process
      currentProcessOutput = "";
      setProcessOutput("");
      outputListeners.forEach((listener) => listener("")); // Clear listeners

      console.log("Invoking start_engine_process with:", {
        path: "",
        processId,
      });
      const response = await invoke<ProcessResponse>("start_engine_process", {
        path: "", // Path is ignored on desktop, uses bundled executable
        processId,
      });

      console.log("start_engine_process response:", response);

      if (response.success) {
        const newProcess: DesktopProcess = {
          id: processId,
        };

        setEngineProcess(newProcess);
        console.log("Engine process started successfully:", newProcess);
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
    <DesktopEngineProcessContext.Provider
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
    </DesktopEngineProcessContext.Provider>
  );
}

export function useDesktopEngineProcess() {
  const context = useContext(DesktopEngineProcessContext);
  if (context === undefined) {
    throw new Error(
      "useDesktopEngineProcess must be used within DesktopEngineProcessProvider"
    );
  }
  return context;
}
