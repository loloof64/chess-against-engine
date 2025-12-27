package com.loloof64.chess_against_engine

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

class ChessEnginesHelper(private val activity: Activity) {

    fun getInstalledEngines(): String {
        return try {
            val engines = mutableListOf<Map<String, Any>>()
            
            val pm = activity.packageManager
            
            // Search for apps that handle intent.chess.provider.ENGINE
            val engineIntent = Intent("intent.chess.provider.ENGINE")
            val resolveInfos = pm.queryIntentActivities(engineIntent, PackageManager.MATCH_DEFAULT_ONLY)
            
            Log.d("ChessEnginesHelper", "Found ${resolveInfos.size} chess engines")
            
            resolveInfos.forEach { resolveInfo ->
                Log.d("ChessEnginesHelper", "Engine found: ${resolveInfo.activityInfo.packageName}")
                engines.add(mapOf(
                    "name" to (resolveInfo.activityInfo.loadLabel(pm).toString() ?: "Unknown"),
                    "packageName" to (resolveInfo.activityInfo.packageName ?: "Unknown"),
                    "path" to "",
                    "supportedProtocols" to listOf("UCI")
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