use serde::{Deserialize, Serialize};
use std::collections::HashMap;
#[allow(unused)]
use std::io::{BufRead, BufReader, Write};
use std::path::PathBuf;
#[allow(unused)]
use std::process::{Child, ChildStdout, Stdio};
use std::sync::Mutex;
use std::thread;
use tauri_plugin_log::{Target, TargetKind};

// Shared buffer for engine output per process
lazy_static::lazy_static! {
    static ref ENGINE_OUTPUT_BUFFER: Mutex<HashMap<String, Vec<String>>> = Mutex::new(HashMap::new());
}

#[allow(unused)]
fn get_resource_dir() -> PathBuf {
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

#[cfg(target_os = "linux")]
#[allow(unused)]
fn get_executable_path() -> String {
    get_resource_dir()
        .join("linux/stockfish-ubuntu-x86-64-avx2")
        .to_string_lossy()
        .to_string()
}

#[cfg(target_os = "windows")]
#[allow(unused)]
fn get_executable_path() -> String {
    get_resource_dir()
        .join("windows/stockfish-windows-x86-64-avx2.exe")
        .to_string_lossy()
        .to_string()
}

#[derive(Serialize, Deserialize, Debug)]
struct EnginesResponse {
    success: bool,
    engines: Vec<Engine>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Engine {
    name: String,
    path: String,
    #[serde(rename = "packageName")]
    package_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ProcessResponse {
    success: bool,
    message: String,
    process_id: Option<String>,
}

// Store active engine processes
#[allow(dead_code)]
struct EngineProcessManager {
    processes: HashMap<String, EngineProcessInfo>,
}

#[derive(Clone, Debug)]
#[allow(dead_code)]
struct EngineProcessInfo {
    id: String,
    path: String,
}

// Store desktop engine processes with stdin/stdout
#[allow(dead_code)]
struct DesktopEngineProcess {
    id: String,
    child: Child,
}

// Global process manager for Android
lazy_static::lazy_static! {
    static ref PROCESS_MANAGER: Mutex<EngineProcessManager> = Mutex::new(EngineProcessManager {
        processes: HashMap::new(),
    });

    // Global process manager for desktop
    static ref DESKTOP_PROCESS_MANAGER: Mutex<HashMap<String, DesktopEngineProcess>> = Mutex::new(HashMap::new());
}

#[allow(unused)]
fn spawn_output_reader(process_id: String, stdout: ChildStdout) {
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

#[cfg(any(target_os = "windows", target_os = "linux"))]
#[allow(unused)]
fn start_engine_process_from_desktop(
    process_id: String,
    app_handle: tauri::AppHandle,
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

#[cfg(any(target_os = "windows", target_os = "linux"))]
#[allow(unused)]
fn send_command_to_desktop_engine(process_id: String, command: String) -> ProcessResponse {
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

#[cfg(any(target_os = "windows", target_os = "linux"))]
#[allow(unused)]
fn stop_engine_process_from_desktop(process_id: String) -> ProcessResponse {
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

#[tauri::command]
fn get_installed_engines() -> EnginesResponse {
    #[cfg(target_os = "android")]
    {
        match get_engines_from_android() {
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

#[cfg(target_os = "android")]
fn get_engines_from_android() -> Result<EnginesResponse, Box<dyn std::error::Error>> {
    use jni::objects::JString;
    use ndk_context;

    eprintln!("Starting JNI call to Android");

    // Get the Android VM context
    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };

    eprintln!("JavaVM obtained");

    let mut env = vm.get_env()?;

    eprintln!("JNI env obtained");

    // Call the static method AndroidBridge.getInstalledEngines()
    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    eprintln!("AndroidBridge class found");

    let result =
        env.call_static_method(class, "getInstalledEngines", "()Ljava/lang/String;", &[])?;

    eprintln!("JNI method called successfully");

    let jstring = JString::from(result.l()?);
    let result_string: String = env.get_string(&jstring)?.into();

    eprintln!("Result string: {}", result_string);

    let response: EnginesResponse = serde_json::from_str(&result_string)?;
    eprintln!("Parsed response: {:?}", response);

    Ok(response)
}

#[tauri::command]
#[allow(unused)]
fn start_engine_process(
    path: String,
    process_id: String,
    app_handle: tauri::AppHandle,
) -> ProcessResponse {
    #[cfg(target_os = "android")]
    return match start_engine_from_android(&path, &process_id) {
        Ok(_) => {
            // Store the process info
            let mut manager = PROCESS_MANAGER.lock().unwrap();
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

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return start_engine_process_from_desktop(process_id, app_handle);

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    return ProcessResponse {
        success: false,
        message: "Engine process management not available on this platform".to_string(),
        process_id: None,
    };
}

#[tauri::command]
#[allow(unused)]
fn stop_engine_process(process_id: String) -> ProcessResponse {
    #[cfg(target_os = "android")]
    return match stop_engine_from_android(&process_id) {
        Ok(_) => {
            // Remove from process manager
            let mut manager = PROCESS_MANAGER.lock().unwrap();
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

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return stop_engine_process_from_desktop(process_id);

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    return ProcessResponse {
        success: false,
        message: "Engine process management not available on this platform".to_string(),
        process_id: None,
    };
}

#[tauri::command]
#[allow(unused)]
fn send_engine_command(process_id: String, command: String) -> ProcessResponse {
    #[cfg(target_os = "android")]
    {
        let manager = PROCESS_MANAGER.lock().unwrap();
        if !manager.processes.contains_key(&process_id) {
            return ProcessResponse {
                success: false,
                message: format!("Process {} not found", process_id),
                process_id: None,
            };
        }
    }

    #[cfg(target_os = "android")]
    return match send_command_to_engine_android(&process_id, &command) {
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

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return send_command_to_desktop_engine(process_id, command);

    #[cfg(not(any(target_os = "android", target_os = "windows", target_os = "linux")))]
    return ProcessResponse {
        success: false,
        message: "Engine process management not available on this platform".to_string(),
        process_id: None,
    };
}

#[tauri::command]
fn flush_buffered_engine_output() -> ProcessResponse {
    #[cfg(target_os = "android")]
    return match flush_buffered_output_android() {
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

#[derive(Serialize, Deserialize, Debug)]
struct EngineOutputResponse {
    success: bool,
    outputs: Vec<String>,
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

#[cfg(target_os = "android")]
fn start_engine_from_android(
    path: &str,
    process_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;

    let path_jstring = env.new_string(path)?;
    let process_id_jstring = env.new_string(process_id)?;

    env.call_static_method(
        class,
        "startEngineProcess",
        "(Ljava/lang/String;Ljava/lang/String;)Z",
        &[(&path_jstring).into(), (&process_id_jstring).into()],
    )?;

    Ok(())
}

#[cfg(target_os = "android")]
fn stop_engine_from_android(process_id: &str) -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    let process_id_jstring = env.new_string(process_id)?;

    env.call_static_method(
        class,
        "stopEngineProcess",
        "(Ljava/lang/String;)Z",
        &[(&process_id_jstring).into()],
    )?;

    Ok(())
}

#[cfg(target_os = "android")]
fn send_command_to_engine_android(
    process_id: &str,
    command: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    let process_id_jstring = env.new_string(process_id)?;
    let command_jstring = env.new_string(command)?;

    env.call_static_method(
        class,
        "sendCommandToEngine",
        "(Ljava/lang/String;Ljava/lang/String;)Z",
        &[(&process_id_jstring).into(), (&command_jstring).into()],
    )?;

    Ok(())
}

#[cfg(target_os = "android")]
fn flush_buffered_output_android() -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    env.call_static_method(class, "flushBufferedOutput", "()V", &[])?;

    Ok(())
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
            get_buffered_engine_output
        ])
        .setup(|_app| Ok(()))
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                // Kill all engine processes on app exit
                #[cfg(any(target_os = "windows", target_os = "linux"))]
                {
                    let mut manager = DESKTOP_PROCESS_MANAGER.lock().unwrap();
                    for (process_id, mut process) in manager.drain() {
                        let _ = process.child.kill();
                        eprintln!("Engine process killed on exit: {}", process_id);
                    }
                }
            }
        });
}
