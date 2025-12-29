use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Mutex;

// Shared types
#[derive(Serialize, Deserialize, Debug)]
pub struct EnginesResponse {
    pub success: bool,
    pub engines: Vec<Engine>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Engine {
    pub name: String,
    pub path: String,
    #[serde(rename = "packageName")]
    pub package_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ProcessResponse {
    pub success: bool,
    pub message: String,
    pub process_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EngineOutputResponse {
    pub success: bool,
    pub outputs: Vec<String>,
}

// Store process information
#[derive(Clone, Debug)]
#[allow(dead_code)]
pub struct EngineProcessInfo {
    pub id: String,
    pub path: String,
}

// Shared buffer for engine output per process
lazy_static::lazy_static! {
    pub static ref ENGINE_OUTPUT_BUFFER: Mutex<HashMap<String, Vec<String>>> = Mutex::new(HashMap::new());
}

// Platform-specific resource directory
#[allow(unused)]
pub fn get_resource_dir() -> PathBuf {
    #[cfg(debug_assertions)]
    {
        // In development, resources are at src-tauri/resources
        PathBuf::from("../src-tauri/resources")
    }
    #[cfg(not(debug_assertions))]
    {
        // In production, resources are bundled with the application
        // Try multiple locations for cross-platform compatibility (AppImage, deb, rpm, etc.)

        // 1. For Windows and macOS: Try next to executable first
        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                // Try resources directory
                let path = exe_dir.join("resources");
                if path.exists() {
                    return path;
                }
                // NSIS may put resources directly in exe directory
                // Check if the exe_dir itself contains resources
                if exe_dir.join("windows").exists() || exe_dir.join("linux").exists() {
                    return exe_dir.to_path_buf();
                }
                // Try ../resources (for some installations)
                let path = exe_dir
                    .parent()
                    .map(|p| p.join("resources"))
                    .filter(|p| p.exists());
                if let Some(p) = path {
                    return p;
                }
            }
        }

        // 2. Try AppImage APPDIR environment variable (Linux)
        if let Ok(appdir) = std::env::var("APPDIR") {
            // AppImage structure: $APPDIR/usr/lib/chess-against-engine/resources
            let path = PathBuf::from(&appdir).join("usr/lib/chess-against-engine/resources");
            if path.exists() {
                return path;
            }
            // Also try $APPDIR/usr/bin/resources
            let path = PathBuf::from(&appdir).join("usr/bin/resources");
            if path.exists() {
                return path;
            }
        }

        // 3. Try system-wide installation paths (Linux)
        for sys_path in &[
            "/usr/lib/chess-against-engine/resources",
            "/usr/lib64/chess-against-engine/resources",
            "/usr/bin/resources",
            "/usr/lib/resources",
        ] {
            let path = PathBuf::from(sys_path);
            if path.exists() {
                return path;
            }
        }

        // Fallback
        PathBuf::from("resources")
    }
}
