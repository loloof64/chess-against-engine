import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

type ScreenOrientation = "landscape" | "portrait";

async function getWindowOrientation(): Promise<ScreenOrientation> {
  if (window && window.innerWidth !== undefined) {
    // Web/Android
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  } else {
    // Tauri desktop
    const win = getCurrentWindow();
    const size = await win.innerSize();
    return size.width > size.height ? "landscape" : "portrait";
  }
}

function useWindowOrientation() {
  const [orientation, setOrientation] =
    useState<ScreenOrientation>("landscape");

  useEffect(() => {
    getWindowOrientation().then(setOrientation);

    let unlisten: (() => void) | undefined;

    // Detect if running in Tauri (desktop)
    const isTauri = "__TAURI_IPC__" in window;

    if (isTauri) {
      listen("tauri://resize", async () => {
        setOrientation(await getWindowOrientation());
      }).then((un) => {
        unlisten = un;
      });
    } else {
      const handler = () => {
        setOrientation(
          window.innerWidth > window.innerHeight ? "landscape" : "portrait"
        );
      };
      window.addEventListener("resize", handler);
      window.addEventListener("orientationchange", handler);
      unlisten = () => {
        window.removeEventListener("resize", handler);
        window.removeEventListener("orientationchange", handler);
      };
    }

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return { orientation };
}

export default useWindowOrientation;
