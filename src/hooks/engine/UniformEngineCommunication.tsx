import {
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useAndroidEngineProcess } from "./AndroidEngineProcessContext";
import { useDesktopEngineProcess } from "./DesktopEngineProcessContext";
import getPlatformKind, { PlatformKind } from "../../utils/PlatformKind";
import { OutputListener } from "./common";

interface UniformEngineCommunicationContextType {
  sendCommandToInstalledEngine: (command: string) => void;
  addOutputListener: (listener: OutputListener) => () => void;
}

const UniformEngineCommunicationContext = createContext<
  UniformEngineCommunicationContextType | undefined
>(undefined);

export function UniformEngineCommunicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Store custom listeners - use useRef to maintain same reference across renders
  const customListenersRef = useRef(new Set<OutputListener>());

  const {
    sendCommandToEngine: sendCommandToAndroidEngine,
    engineProcess: androidEngineProcess,
    addOutputListener: addAndroidOutputListener,
  } = useAndroidEngineProcess();
  const {
    sendCommandToEngine: sendCommandToDesktopEngine,
    engineProcess: desktopEngineProcess,
    addOutputListener: addDesktopOutputListener,
  } = useDesktopEngineProcess();

  // Set up Android engine output listener
  useEffect(() => {
    if (!androidEngineProcess) {
      console.log("No android engine process running");
      return;
    }

    console.log("Setting up android engine output listener");
    const unsubscribe = addAndroidOutputListener((output) => {
      customListenersRef.current.forEach((listener) => listener(output));
    });

    return unsubscribe;
  }, [addAndroidOutputListener, androidEngineProcess]);

  // Set up desktop engine output listener
  useEffect(() => {
    if (!desktopEngineProcess) {
      console.log("No desktop engine process running");
      return;
    }

    console.log("Setting up desktop engine output listener");
    const unsubscribe = addDesktopOutputListener((output) => {
      customListenersRef.current.forEach((listener) => listener(output));
    });

    return unsubscribe;
  }, [addDesktopOutputListener, desktopEngineProcess]);

  const sendCommandToInstalledEngine = useCallback(
    (command: string) => {
      if (getPlatformKind() === PlatformKind.desktop) {
        sendCommandToDesktopEngine(command + "\n");
      } else {
        sendCommandToAndroidEngine(command + "\n");
      }
    },
    [sendCommandToAndroidEngine, sendCommandToDesktopEngine]
  );

  const addOutputListener = useCallback((listener: OutputListener) => {
    customListenersRef.current.add(listener);
    return () => {
      customListenersRef.current.delete(listener);
    };
  }, []);

  return (
    <UniformEngineCommunicationContext.Provider
      value={{ sendCommandToInstalledEngine, addOutputListener }}
    >
      {children}
    </UniformEngineCommunicationContext.Provider>
  );
}

export function useUniformEngineCommunication() {
  const context = useContext(UniformEngineCommunicationContext);
  if (context === undefined) {
    throw new Error(
      "useUniformEngineCommunication must be used within UniformEngineCommunicationProvider"
    );
  }
  return context;
}
