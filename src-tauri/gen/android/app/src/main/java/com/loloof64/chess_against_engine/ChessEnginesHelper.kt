
// using code from https://github.com/gkalab/chessenginesupport-androidlib
package com.loloof64.chess_against_engine

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import com.kalab.chess.enginesupport.ChessEngineResolver

class ChessEnginesHelper(private val activity: Activity) {

    fun getInstalledEngines(): String {
        return try {
            val engines = mutableListOf<Map<String, Any>>()
            val enginesResolver = ChessEngineResolver(activity)
            val resolveInfos = enginesResolver.resolveEngines()
            
            Log.d("ChessEnginesHelper", "Found ${resolveInfos.size} chess engines")
        
            resolveInfos.forEach { resolveInfo ->
                Log.d("ChessEnginesHelper", "Engine found: ${resolveInfo.packageName}")
                engines.add(mapOf(
                    "name" to resolveInfo.name,
                    "packageName" to resolveInfo.packageName,
                    "path" to resolveInfo.enginePath,
                ))
            }
            
            val jsonArray = JSONArray()
            engines.forEach { engine ->
                val jsonObject = JSONObject(engine)
                jsonArray.put(jsonObject)
            }
            
            Log.d("ChessEnginesHelper", "Total engines found: ${engines.size}")
            
            JSONObject().apply {
                put("success", true)
                put("engines", jsonArray)
            }.toString()
        } catch (e: Exception) {
            Log.e("ChessEnginesHelper", "Error: ${e.message}", e)
            JSONObject().apply {
                put("success", false)
                put("error", e.message ?: "Unknown error")
            }.toString()
        }
    }
}