use tauri_plugin_log::{Target, TargetKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn test_command() -> String {
    "Hello from Rust".to_string()
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct EnginesResponse {
    success: bool,
    engines: Vec<Engine>,
}

#[derive(Serialize, Deserialize)]
struct Engine {
    name: String,
    path: String,
    #[serde(rename = "packageName")]
    package_name: String,
    #[serde(rename = "supportedProtocols")]
    supported_protocols: Vec<String>,
}

#[tauri::command]
fn get_installed_engines() -> EnginesResponse {
    EnginesResponse {
        success: true,
        engines: vec![Engine {
            name: "Stockfish".to_string(),
            path: "/data/chess/stockfish".to_string(),
            package_name: "com.example.stockfish".to_string(),
            supported_protocols: vec!["UCI".to_string()],
        }],
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(Target::new(TargetKind::Webview))
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            test_command,
            get_installed_engines
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
