import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

type ScreenOrientation = "landscape" | "portrait";

async function getWindowOrientation(): Promise<ScreenOrientation> {
  const window = getCurrentWindow();
  const size = await window.innerSize();

  const orientation = size.width > size.height ? "landscape" : "portrait";
  return orientation;
}

function useWindowOrientation() {
  const [orientation, setOrientation] = useState("landscape");

  useEffect(() => {
    getWindowOrientation().then((value) => setOrientation(value));
  });

  useEffect(() => {
    listen("tauri://resize", async () => {
      const orientation = await getWindowOrientation();
      setOrientation(orientation);
    }).catch((ex) => console.error(ex));
  });

  return { orientation };
}

export default useWindowOrientation;
