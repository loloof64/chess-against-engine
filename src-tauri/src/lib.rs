use serde::{Deserialize, Serialize};
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
    #[serde(rename = "supportedProtocols")]
    supported_protocols: Vec<String>,
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
        .invoke_handler(tauri::generate_handler![get_installed_engines])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
