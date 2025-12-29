mod engine {
    #[cfg(target_os = "android")]
    pub mod android;
    pub mod common;
    #[cfg(any(target_os = "windows", target_os = "linux"))]
    pub mod desktop;
}

use engine::common::*;
use tauri_plugin_log::{Target, TargetKind};

#[tauri::command]
fn debug_engine_path(app_handle: tauri::AppHandle) -> ProcessResponse {
    #[cfg(any(target_os = "windows", target_os = "linux"))]
    {
        match engine::desktop::get_executable_path(&app_handle) {
            Ok(path) => {
                ProcessResponse {
                    success: true,
                    message: format!("Engine path: {}", path),
                    process_id: None,
                }
            }
            Err(e) => {
                ProcessResponse {
                    success: false,
                    message: e,
                    process_id: None,
                }
            }
        }
    }

    #[cfg(not(any(target_os = "windows", target_os = "linux")))]
    {
        ProcessResponse {
            success: false,
            message: "Not available on this platform".to_string(),
            process_id: None,
        }
    }
}

#[tauri::command]
fn get_installed_engines() -> EnginesResponse {
    #[cfg(target_os = "android")]
    {
        match engine::android::get_engines_from_android() {
            Ok(result) => return result,
            Err(e) => eprintln!("Error calling Android: {}", e),
        }
    }

    // Fallback
    EnginesResponse {
        success: true,
        engines: vec![],
    }
}

#[tauri::command]
#[allow(unused)]
fn start_engine_process(
    path: String,
    process_id: String,
    app_handle: tauri::AppHandle,
) -> ProcessResponse {
    #[cfg(target_os = "android")]
    {
        return match engine::android::start_engine_from_android(&path, &process_id) {
            Ok(_) => {
                // Store the process info
                let mut manager = engine::android::PROCESS_MANAGER.lock().unwrap();
                manager.processes.insert(
                    process_id.clone(),
                    EngineProcessInfo {
                        id: process_id.clone(),
                        path: path.clone(),
                    },
                );
                eprintln!("Engine process started: {} at {}", process_id, path);
                ProcessResponse {
                    success: true,
                    message: format!("Engine process started: {}", process_id),
                    process_id: Some(process_id),
                }
            }
            Err(e) => {
                eprintln!("Error starting engine: {}", e);
                ProcessResponse {
                    success: false,
                    message: format!("Failed to start engine: {}", e),
                    process_id: None,
                }
            }
        };
    }

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    {
        return engine::desktop::start_engine_process_from_desktop(process_id, app_handle);
    }

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    {
        return ProcessResponse {
            success: false,
            message: "Engine process management not available on this platform".to_string(),
            process_id: None,
        };
    }
}

#[tauri::command]
#[allow(unused)]
fn stop_engine_process(process_id: String) -> ProcessResponse {
    #[cfg(target_os = "android")]
    {
        return match engine::android::stop_engine_from_android(&process_id) {
            Ok(_) => {
                // Remove from process manager
                let mut manager = engine::android::PROCESS_MANAGER.lock().unwrap();
                manager.processes.remove(&process_id);
                eprintln!("Engine process stopped: {}", process_id);
                ProcessResponse {
                    success: true,
                    message: format!("Engine process stopped: {}", process_id),
                    process_id: Some(process_id),
                }
            }
            Err(e) => {
                eprintln!("Error stopping engine: {}", e);
                ProcessResponse {
                    success: false,
                    message: format!("Failed to stop engine: {}", e),
                    process_id: None,
                }
            }
        };
    }

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    {
        return engine::desktop::stop_engine_process_from_desktop(process_id);
    }

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    {
        return ProcessResponse {
            success: false,
            message: "Engine process management not available on this platform".to_string(),
            process_id: None,
        };
    }
}

#[tauri::command]
#[allow(unused)]
fn send_engine_command(process_id: String, command: String) -> ProcessResponse {
    #[cfg(target_os = "android")]
    {
        return match engine::android::send_command_to_engine_android(&process_id, &command) {
            Ok(_) => {
                eprintln!("Command sent to engine {}: {}", process_id, command);
                ProcessResponse {
                    success: true,
                    message: format!("Command sent to engine"),
                    process_id: Some(process_id),
                }
            }
            Err(e) => {
                eprintln!("Error sending command to engine: {}", e);
                ProcessResponse {
                    success: false,
                    message: format!("Failed to send command: {}", e),
                    process_id: None,
                }
            }
        };
    }

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    {
        return engine::desktop::send_command_to_desktop_engine(process_id, command);
    }

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    {
        return ProcessResponse {
            success: false,
            message: "Engine process management not available on this platform".to_string(),
            process_id: None,
        };
    }
}

#[tauri::command]
fn flush_buffered_engine_output() -> ProcessResponse {
    #[cfg(target_os = "android")]
    return match engine::android::flush_buffered_output_android() {
        Ok(_) => {
            eprintln!("Flushed buffered engine output");
            ProcessResponse {
                success: true,
                message: "Buffered output flushed".to_string(),
                process_id: None,
            }
        }
        Err(e) => {
            eprintln!("Error flushing buffered output: {}", e);
            ProcessResponse {
                success: false,
                message: format!("Failed to flush output: {}", e),
                process_id: None,
            }
        }
    };

    #[cfg(not(target_os = "android"))]
    return ProcessResponse {
        success: false,
        message: "Not on Android".to_string(),
        process_id: None,
    };
}

#[tauri::command]
fn get_buffered_engine_output(process_id: String) -> EngineOutputResponse {
    let mut buffer = ENGINE_OUTPUT_BUFFER.lock().unwrap();

    if let Some(outputs) = buffer.remove(&process_id) {
        EngineOutputResponse {
            success: true,
            outputs,
        }
    } else {
        EngineOutputResponse {
            success: true,
            outputs: vec![],
        }
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
            get_installed_engines,
            start_engine_process,
            stop_engine_process,
            send_engine_command,
            flush_buffered_engine_output,
            get_buffered_engine_output,
            debug_engine_path
        ])
        .setup(|_app| Ok(()))
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                // Kill all engine processes on app exit
                #[cfg(any(target_os = "windows", target_os = "linux"))]
                {
                    let mut manager = engine::desktop::DESKTOP_PROCESS_MANAGER.lock().unwrap();
                    for (process_id, mut process) in manager.drain() {
                        let _ = process.child.kill();
                        eprintln!("Engine process killed on exit: {}", process_id);
                    }
                }
            }
        });
}
