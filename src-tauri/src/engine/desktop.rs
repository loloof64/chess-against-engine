use super::common::*;
use std::collections::HashMap;
use std::io::BufRead;
use std::io::BufReader;
use std::io::Write;
use std::process::{Child, ChildStdout, Stdio};
use std::sync::Mutex;
use std::thread;

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
pub fn get_executable_path() -> String {
    get_resource_dir()
        .join("linux/stockfish-ubuntu-x86-64-avx2")
        .to_string_lossy()
        .to_string()
}

#[cfg(target_os = "windows")]
#[allow(unused)]
pub fn get_executable_path() -> String {
    get_resource_dir()
        .join("windows/stockfish-windows-x86-64-avx2.exe")
        .to_string_lossy()
        .to_string()
}

#[allow(unused)]
pub fn start_engine_process_from_desktop(
    process_id: String,
    _app_handle: tauri::AppHandle,
) -> ProcessResponse {
    use std::process::Command;

    let executable_path = get_executable_path();

    match Command::new(&executable_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
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

            eprintln!(
                "Engine process started: {} at {}",
                process_id, executable_path
            );
            ProcessResponse {
                success: true,
                message: format!("Engine process started: {}", process_id),
                process_id: Some(process_id),
            }
        }
        Err(e) => {
            eprintln!("Error starting engine from {}: {}", executable_path, e);
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
                    eprintln!("Command sent to engine {}: {}", process_id, command);
                    ProcessResponse {
                        success: true,
                        message: "Command sent to engine".to_string(),
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
                eprintln!("Engine process killed: {}", process_id);
                ProcessResponse {
                    success: true,
                    message: format!("Engine process stopped: {}", process_id),
                    process_id: Some(process_id),
                }
            }
            Err(e) => {
                eprintln!("Error killing engine process: {}", e);
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
