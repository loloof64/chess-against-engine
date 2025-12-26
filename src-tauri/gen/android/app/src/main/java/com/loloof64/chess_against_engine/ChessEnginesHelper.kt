package com.loloof64.chess_against_engine

import android.app.Activity
import android.util.Log
import com.kalab.chess.enginesupport.ChessEngineResolver
import org.json.JSONArray
import org.json.JSONObject

class ChessEnginesHelper(private val activity: Activity) {

    fun getInstalledEngines(): String {
        return try {
            Log.d("ChessEngines", "Start fetching engines")
            
            val resolver = ChessEngineResolver(activity)
            Log.d("ChessEngines", "Resolver created")
            
            val engines = resolver.resolveEngines()
            Log.d("ChessEngines", "Engines count: ${engines.size}")
            
            val jsonArray = JSONArray()
            
            engines.forEach { engine ->
                try {
                    Log.d("ChessEngines", "Processing engine: ${engine.javaClass.simpleName}")
                    val jsonObject = JSONObject()
                    jsonObject.put("name", engine.javaClass.simpleName)
                    jsonObject.put("packageName", activity.packageName)
                    jsonObject.put("path", "")
                    jsonObject.put("supportedProtocols", JSONArray())
                    
                    jsonArray.put(jsonObject)
                } catch (e: Exception) {
                    Log.e("ChessEngines", "Error for engine", e)
                }
            }
            
            Log.d("ChessEngines", "Return result with ${jsonArray.length()} engines")
            JSONObject().apply {
                put("success", true)
                put("engines", jsonArray)
            }.toString()
        } catch (e: Exception) {
            Log.e("ChessEngines", "General error", e)
            JSONObject().apply {
                put("success", false)
                put("error", e.message ?: "Unknown error")
            }.toString()
        }
    }
}