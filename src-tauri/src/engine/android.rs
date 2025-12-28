use super::common::*;

// Store Android engine processes
lazy_static::lazy_static! {
    pub static ref PROCESS_MANAGER: std::sync::Mutex<EngineProcessManager> = std::sync::Mutex::new(EngineProcessManager {
        processes: std::collections::HashMap::new(),
    });
}

#[allow(dead_code)]
pub struct EngineProcessManager {
    pub processes: std::collections::HashMap<String, EngineProcessInfo>,
}

pub fn get_engines_from_android() -> Result<EnginesResponse, Box<dyn std::error::Error>> {
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

pub fn start_engine_from_android(
    path: &str,
    process_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    eprintln!(
        "Rust: start_engine_from_android called with path={}, process_id={}",
        path, process_id
    );

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    eprintln!("Rust: Found Java VM");

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    eprintln!("Rust: Found AndroidBridge class");

    let path_jstring = env.new_string(path)?;
    let process_id_jstring = env.new_string(process_id)?;

    eprintln!("Rust: Created JStrings");

    let _result = env.call_static_method(
        class,
        "startEngineProcess",
        "(Ljava/lang/String;Ljava/lang/String;)Z",
        &[(&path_jstring).into(), (&process_id_jstring).into()],
    )?;

    eprintln!("Rust: Called startEngineProcess on Android side");

    Ok(())
}

pub fn stop_engine_from_android(process_id: &str) -> Result<(), Box<dyn std::error::Error>> {
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

pub fn send_command_to_engine_android(
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

pub fn flush_buffered_output_android() -> Result<(), Box<dyn std::error::Error>> {
    use ndk_context;

    let vm_ptr = ndk_context::android_context().vm();
    let vm = unsafe { jni::JavaVM::from_raw(vm_ptr as *mut jni::sys::JavaVM)? };
    let mut env = vm.get_env()?;

    let class = env.find_class("com/loloof64/chess_against_engine/AndroidBridge")?;
    env.call_static_method(class, "flushBufferedOutput", "()V", &[])?;

    Ok(())
}
