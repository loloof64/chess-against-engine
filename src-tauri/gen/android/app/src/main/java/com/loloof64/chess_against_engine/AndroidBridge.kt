package com.loloof64.chess_against_engine

import android.util.Log

object AndroidBridge {
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
}