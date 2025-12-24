import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import os from "os";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// Get local IP for Android dev
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const isAndroid = process.env.TAURI_PLATFORM === "android";
  const devHost = isAndroid ? getLocalIP() : host || "localhost";
  const hmrHost = isAndroid ? "10.0.2.2" : host;

  return {
    plugins: [react()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: devHost,
      hmr: hmrHost
        ? {
            protocol: "ws",
            host: hmrHost,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell Vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
