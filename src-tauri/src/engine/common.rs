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
        // In production, resources are bundled next to the executable
        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                return exe_dir.join("resources");
            }
        }
        // Fallback
        PathBuf::from("resources")
    }
}
