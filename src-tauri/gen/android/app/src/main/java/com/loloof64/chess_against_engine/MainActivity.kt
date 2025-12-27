package com.loloof64.chess_against_engine

import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge

class MainActivity : TauriActivity() {
    companion object {
        @JvmStatic
        lateinit var instance: MainActivity
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        Log.d("Tauri", "MainActivity onCreate called")
        instance = this
        super.onCreate(savedInstanceState)
    }
}