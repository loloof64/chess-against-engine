package com.loloof64.chess_against_engine

import android.app.Activity
import android.util.Log

object ChessEnginesBridge {
    lateinit var activity: Activity
    
    fun init(act: Activity) {
        activity = act
    }
    
    @JvmStatic
    fun getInstalledEngines(): String {
        Log.d("ChessEngines", "getInstalledEngines called from JNI")
        return try {
            val helper = ChessEnginesHelper(activity)
            helper.getInstalledEngines()
        } catch (e: Exception) {
            Log.e("ChessEngines", "Error", e)
            """{"success":false,"error":"${e.message}"}"""
        }
    }
}