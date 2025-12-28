package com.loloof64.chess_against_engine

import android.util.Log
import android.webkit.WebView
import java.io.BufferedReader
import java.io.BufferedWriter
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import kotlin.concurrent.thread
import org.json.JSONObject

data class ManagedProcess(
    val processId: String,
    val path: String,
    val process: Process,
    val inputWriter: BufferedWriter,
    val outputReader: BufferedReader
)

object AndroidBridge {
    private val managedProcesses = mutableMapOf<String, ManagedProcess>()
    private var webView: WebView? = null
    private val outputBuffer = mutableListOf<String>()  // Buffer for outputs before JS function exists
    private var jsInitialized = false

    fun setWebView(view: WebView) {
        webView = view
    }

    @JvmStatic
    fun getInstalledEngines(): String {
        Log.d("ChessEngines", "getInstalledEngines called from Rust")
        return try {
            val activity = MainActivity.instance
            val helper = ChessEnginesHelper(activity)
            val result = helper.getInstalledEngines()
            Log.d("ChessEngines", "Result: $result")
            result
        } catch (e: Exception) {
            Log.e("ChessEngines", "Error", e)
            """{"success":false,"error":"${e.message}"}"""
        }
    }

    @JvmStatic
    fun startEngineProcess(path: String, processId: String): Boolean {
        return try {
            Log.d("EngineProcess", "Starting engine process: $path with ID: $processId")
            
            // Verify the file exists and is executable
            val engineFile = java.io.File(path)
            if (!engineFile.exists()) {
                Log.e("EngineProcess", "Engine file does not exist at path: $path")
                Log.e("EngineProcess", "File absolute path: ${engineFile.absolutePath}")
                Log.e("EngineProcess", "Parent exists: ${engineFile.parentFile?.exists()}")
                return false
            }
            
            Log.d("EngineProcess", "Engine file exists. File size: ${engineFile.length()} bytes")
            Log.d("EngineProcess", "Is file: ${engineFile.isFile}")
            Log.d("EngineProcess", "Can read: ${engineFile.canRead()}")
            
            if (!engineFile.canExecute()) {
                Log.w("EngineProcess", "Engine file is not executable, attempting to set executable permissions")
                if (!engineFile.setExecutable(true, false)) {
                    Log.e("EngineProcess", "Failed to set executable permissions on file")
                }
            }
            Log.d("EngineProcess", "File is now executable: ${engineFile.canExecute()}")

            // Check if process already exists
            if (managedProcesses.containsKey(processId)) {
                Log.w("EngineProcess", "Process $processId already exists")
                return false
            }

            // Start the process
            Log.d("EngineProcess", "About to start ProcessBuilder with path: $path")
            val processBuilder = ProcessBuilder(path)
            processBuilder.redirectErrorStream(true)
            
            // Set environment variable for library path
            val env = processBuilder.environment()
            if (engineFile.parent != null) {
                env["LD_LIBRARY_PATH"] = "${engineFile.parentFile?.absolutePath}:${env["LD_LIBRARY_PATH"] ?: ""}"
                Log.d("EngineProcess", "Set LD_LIBRARY_PATH to: ${env["LD_LIBRARY_PATH"]}")
            }
            
            Log.d("EngineProcess", "Starting process...")
            val process = processBuilder.start()
            Log.d("EngineProcess", "Process started successfully")

            // Create input/output streams
            val inputWriter = BufferedWriter(OutputStreamWriter(process.outputStream))
            val outputReader = BufferedReader(InputStreamReader(process.inputStream))

            // Create managed process
            val managedProcess = ManagedProcess(
                processId = processId,
                path = path,
                process = process,
                inputWriter = inputWriter,
                outputReader = outputReader
            )

            managedProcesses[processId] = managedProcess
            Log.d("EngineProcess", "Process added to managedProcesses, current count: ${managedProcesses.size}")

            // Start listening to output in a separate thread
            listenToProcessOutput(processId, outputReader)

            Log.d("EngineProcess", "Engine process started successfully: $processId")
            true
        } catch (e: Exception) {
            Log.e("EngineProcess", "Error starting engine process: ${e.message}", e)
            e.printStackTrace()
            false
        }
    }

    @JvmStatic
    fun stopEngineProcess(processId: String): Boolean {
        return try {
            Log.d("EngineProcess", "Stopping engine process: $processId")

            val managedProcess = managedProcesses[processId]
            if (managedProcess == null) {
                Log.w("EngineProcess", "Process $processId not found")
                return false
            }

            // Close streams
            try {
                managedProcess.inputWriter.close()
                managedProcess.outputReader.close()
            } catch (e: Exception) {
                Log.w("EngineProcess", "Error closing streams: ${e.message}")
            }

            // Terminate process
            managedProcess.process.destroy()

            // Remove from map
            managedProcesses.remove(processId)

            Log.i("EngineProcess", "ENGINE EXITED: $processId")
            true
        } catch (e: Exception) {
            Log.e("EngineProcess", "Error stopping engine process: ${e.message}", e)
            false
        }
    }

    @JvmStatic
    fun sendCommandToEngine(processId: String, command: String): Boolean {
        return try {
            Log.d("EngineProcess", "Sending command to engine $processId: $command")

            val managedProcess = managedProcesses[processId]
            if (managedProcess == null) {
                Log.w("EngineProcess", "Process $processId not found")
                return false
            }

            // Send command to process
            managedProcess.inputWriter.write(command)
            managedProcess.inputWriter.newLine()
            managedProcess.inputWriter.flush()

            Log.d("EngineProcess", "Command sent successfully to $processId")
            true
        } catch (e: Exception) {
            Log.e("EngineProcess", "Error sending command to engine: ${e.message}", e)
            false
        }
    }

    private fun listenToProcessOutput(processId: String, reader: BufferedReader) {
        thread {
            try {
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    if (line != null) {
                        Log.d("EngineProcess", "Output from $processId: $line")
                        emitOutputToWebView(line!!)
                    }
                }
            } catch (e: Exception) {
                Log.e("EngineProcess", "Error reading from process: ${e.message}", e)
            } finally {
                // Clean up when process ends
                stopEngineProcess(processId)
            }
        }
    }

    private fun emitOutputToWebView(output: String) {
        try {
            // Escape the output properly for JavaScript
            val escapedOutput = JSONObject.quote(output + "\n")
            
            val jsCode = """
                (function() {
                    if (typeof window.__engineEmitOutput === 'function') {
                        window.__engineEmitOutput($escapedOutput);
                    } else {
                        console.error("window.__engineEmitOutput is not a function! Type: " + typeof window.__engineEmitOutput);
                    }
                })();
            """.trimIndent()

            Log.d("EngineProcess", "Emitting output to WebView: $output")
            
            webView?.post {
                Log.d("EngineProcess", "About to evaluate JavaScript for output")
                webView?.evaluateJavascript(jsCode) { result ->
                    Log.d("EngineProcess", "JavaScript evaluation result: $result")
                }
            }
        } catch (e: Exception) {
            Log.e("EngineProcess", "Error emitting output to webview: ${e.message}", e)
        }
    }
    
    @JvmStatic
    fun flushBufferedOutput() {
        Log.d("EngineProcess", "flushBufferedOutput called! Buffer size: ${outputBuffer.size}, jsInitialized: $jsInitialized")
        
        // Mark that JS is now initialized - this prevents future outputs from being buffered
        jsInitialized = true
        
        if (outputBuffer.isEmpty()) {
            Log.d("EngineProcess", "Buffer is empty, nothing to flush")
            return
        }
        
        Log.d("EngineProcess", "Flushing ${outputBuffer.size} buffered outputs")
        
        for ((index, output) in outputBuffer.withIndex()) {
            val escapedOutput = JSONObject.quote(output + "\n")
            val jsCode = "window.__engineEmitOutput($escapedOutput);"
            
            Log.d("EngineProcess", "Flushing output $index: $output")
            
            webView?.post {
                Log.d("EngineProcess", "Evaluating JS for buffered output $index")
                webView?.evaluateJavascript(jsCode, null)
            }
        }
        
        outputBuffer.clear()
        Log.d("EngineProcess", "Flush complete!")
    }
}