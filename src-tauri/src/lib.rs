use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri_plugin_log::{Target, TargetKind};

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

// Global process manager
lazy_static::lazy_static! {
    static ref PROCESS_MANAGER: Mutex<EngineProcessManager> = Mutex::new(EngineProcessManager {
        processes: HashMap::new(),
    });
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
fn start_engine_process(path: String, process_id: String) -> ProcessResponse {
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

    #[cfg(not(target_os = "android"))]
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
    {
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
    }

    #[cfg(not(target_os = "android"))]
    {
        ProcessResponse {
            success: false,
            message: "Engine process management not available on this platform".to_string(),
            process_id: None,
        }
    }
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

    #[cfg(not(target_os = "android"))]
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
            flush_buffered_engine_output
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
