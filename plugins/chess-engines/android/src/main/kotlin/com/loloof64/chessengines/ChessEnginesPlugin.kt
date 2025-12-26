package com.loloof64.chessengines

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke
import com.kalab.chess.enginesupport.ChessEngineResolver
import org.json.JSONArray
import org.json.JSONObject

class ChessEnginesPlugin(private val activity: Activity) : Plugin() {
    
    private val implementation = ChessEnginesImpl(activity)

    @Command
    fun getInstalledEngines(invoke: Invoke) {
        try {
            val engines = implementation.getInstalledEngines()
            val result = JSObject()
            result.put("success", true)
            result.put("engines", engines)
            invoke.resolve(result)
        } catch (e: Exception) {
            val error = JSObject()
            error.put("success", false)
            error.put("error", e.message ?: "Unknown error")
            invoke.reject(error.toString())
        }
    }
}