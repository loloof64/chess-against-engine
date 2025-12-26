package com.loloof64.chessengines

import android.app.Activity
import com.kalab.chess.enginesupport.ChessEngineResolver
import org.json.JSONArray
import org.json.JSONObject

class ChessEnginesImpl(private val activity: Activity) {

    fun getInstalledEngines(): JSONArray {
        val resolver = ChessEngineResolver(activity)
        val engines = resolver.resolveEngines()
        
        val jsonArray = JSONArray()
        
        engines.forEach { engine ->
            val jsonObject = JSONObject()
            jsonObject.put("name", engine.name)
            jsonObject.put("path", engine.path)
            jsonObject.put("packageName", engine.packageName)
            
            val protocolsArray = JSONArray()
            engine.supportedProtocols?.forEach { protocol ->
                protocolsArray.put(protocol)
            }
            jsonObject.put("supportedProtocols", protocolsArray)
            
            jsonArray.put(jsonObject)
        }
        
        return jsonArray
    }
}