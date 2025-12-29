use super::common::*;
use std::collections::HashMap;
use std::io::BufRead;
use std::io::BufReader;
use std::io::Write;
use std::process::{Child, ChildStdout, Stdio};
use std::sync::Mutex;
use std::thread;
use tauri::Manager;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

// Store desktop engine processes with stdin/stdout
#[allow(dead_code)]
pub struct DesktopEngineProcess {
    pub id: String,
    pub child: Child,
}

// Global process manager for desktop
lazy_static::lazy_static! {
    pub static ref DESKTOP_PROCESS_MANAGER: Mutex<HashMap<String, DesktopEngineProcess>> = Mutex::new(HashMap::new());
}

#[allow(unused)]
pub fn spawn_output_reader(process_id: String, stdout: ChildStdout) {
    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(output_line) = line {
                // Buffer the output for the frontend to consume
                let mut buffer = ENGINE_OUTPUT_BUFFER.lock().unwrap();
                buffer
                    .entry(process_id.clone())
                    .or_insert_with(Vec::new)
                    .push(output_line);
            }
        }
    });
}

#[cfg(target_os = "linux")]
#[allow(unused)]
pub fn get_executable_path(app_handle: &tauri::AppHandle) -> Result<String, String> {
    let exe_name = "stockfish-ubuntu-x86-64-avx2";
    
    // When bundled with resources/linux/**/* in tauri.linux.conf.json,
    // Tauri strips the "resources/" prefix, so files end up at linux/file
    let path_variations = vec![
        format!("linux/{}", exe_name),             // Most likely in production
        exe_name.to_string(),                      // If directly in resources
        format!("resources/linux/{}", exe_name),   // Alternative
    ];
    
    for path_var in &path_variations {
        if let Ok(resource_path) = app_handle
            .path()
            .resolve(path_var, tauri::path::BaseDirectory::Resource)
        {
            if resource_path.exists() {
                return Ok(resource_path.to_string_lossy().to_string());
            }
        }
    }

    // Fallback to manual resolution
    let fallback_path = get_resource_dir()
        .join(format!("linux/{}", exe_name));
    
    if fallback_path.exists() {
        Ok(fallback_path.to_string_lossy().to_string())
    } else {
        Err(format!("Engine executable not found. Tried Tauri resource paths: {:?} and fallback: {:?}", 
            path_variations, fallback_path))
    }
}

#[cfg(target_os = "windows")]
#[allow(unused)]
pub fn get_executable_path(app_handle: &tauri::AppHandle) -> Result<String, String> {
    let exe_name = "stockfish-windows-x86-64-avx2.exe";
    
    // When bundled with resources/windows/**/* in tauri.windows.conf.json,
    // Tauri strips the "resources/" prefix, so files end up at windows/file.exe
    // NSIS and MSI may bundle differently, so try multiple variations
    let path_variations = vec![
        format!("windows/{}", exe_name),           // MSI installer
        exe_name.to_string(),                      // NSIS installer (direct)
        format!("resources/windows/{}", exe_name), // Alternative
        format!("resources/{}", exe_name),         // Another alternative
    ];
    
    for path_var in &path_variations {
        if let Ok(resource_path) = app_handle
            .path()
            .resolve(path_var, tauri::path::BaseDirectory::Resource)
        {
            if resource_path.exists() {
                return Ok(resource_path.to_string_lossy().to_string());
            }
        }
    }

    // Fallback to manual resolution
    let fallback_path = get_resource_dir()
        .join(format!("windows/{}", exe_name));
    
    if fallback_path.exists() {
        Ok(fallback_path.to_string_lossy().to_string())
    } else {
        Err(format!("Engine executable not found. Tried Tauri resource paths: {:?} and fallback: {:?}", 
            path_variations, fallback_path))
    }
}

#[allow(unused)]
pub fn start_engine_process_from_desktop(
    process_id: String,
    app_handle: tauri::AppHandle,
) -> ProcessResponse {
    use std::process::Command;

    let executable_path = match get_executable_path(&app_handle) {
        Ok(path) => path,
        Err(e) => {
            return ProcessResponse {
                success: false,
                message: format!("Failed to locate engine executable: {}", e),
                process_id: None,
            };
        }
    };

    let mut command = Command::new(&executable_path);
    command
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    
    // On Windows, prevent console window from appearing
    #[cfg(target_os = "windows")]
    {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }
    
    match command.spawn()
    {
        Ok(mut child) => {
            let stdout = child.stdout.take();

            // Spawn output reader thread before inserting into manager
            if let Some(stdout_handle) = stdout {
                let process_id_clone = process_id.clone();
                spawn_output_reader(process_id_clone, stdout_handle);
            }

            let mut manager = DESKTOP_PROCESS_MANAGER.lock().unwrap();
            manager.insert(
                process_id.clone(),
                DesktopEngineProcess {
                    id: process_id.clone(),
                    child,
                },
            );

            ProcessResponse {
                success: true,
                message: format!("Engine process started: {}", process_id),
                process_id: Some(process_id),
            }
        }
        Err(e) => {
            ProcessResponse {
                success: false,
                message: format!("Failed to start engine: {}", e),
                process_id: None,
            }
        }
    }
}

#[allow(unused)]
pub fn send_command_to_desktop_engine(process_id: String, command: String) -> ProcessResponse {
    let mut manager = DESKTOP_PROCESS_MANAGER.lock().unwrap();

    if let Some(process) = manager.get_mut(&process_id) {
        if let Some(ref mut stdin) = process.child.stdin {
            match writeln!(stdin, "{}", command) {
                Ok(_) => {
                    ProcessResponse {
                        success: true,
                        message: "Command sent to engine".to_string(),
                        process_id: Some(process_id),
                    }
                }
                Err(e) => {
                    ProcessResponse {
                        success: false,
                        message: format!("Failed to send command: {}", e),
                        process_id: None,
                    }
                }
            }
        } else {
            ProcessResponse {
                success: false,
                message: "Engine stdin not available".to_string(),
                process_id: None,
            }
        }
    } else {
        ProcessResponse {
            success: false,
            message: format!("Process {} not found", process_id),
            process_id: None,
        }
    }
}

#[allow(unused)]
pub fn stop_engine_process_from_desktop(process_id: String) -> ProcessResponse {
    let mut manager = DESKTOP_PROCESS_MANAGER.lock().unwrap();

    if let Some(mut process) = manager.remove(&process_id) {
        match process.child.kill() {
            Ok(_) => {
                ProcessResponse {
                    success: true,
                    message: format!("Engine process stopped: {}", process_id),
                    process_id: Some(process_id),
                }
            }
            Err(e) => {
                ProcessResponse {
                    success: false,
                    message: format!("Failed to stop engine: {}", e),
                    process_id: None,
                }
            }
        }
    } else {
        ProcessResponse {
            success: false,
            message: format!("Process {} not found", process_id),
            process_id: None,
        }
    }
}
