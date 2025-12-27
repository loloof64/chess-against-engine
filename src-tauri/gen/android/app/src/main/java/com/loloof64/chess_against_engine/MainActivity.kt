package com.loloof64.chess_against_engine

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.webkit.WebView
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
        
        // Set the WebView in AndroidBridge for engine output communication
        // Use a handler with multiple retries to ensure WebView is ready
        val handler = Handler(Looper.getMainLooper())
        val runnable = object : Runnable {
            var attempts = 0
            override fun run() {
                attempts++
                val webView = findWebView(window.decorView)
                if (webView != null) {
                    AndroidBridge.setWebView(webView)
                    Log.d("EngineProcess", "WebView set in AndroidBridge successfully on attempt $attempts")
                } else {
                    if (attempts < 10) {
                        Log.d("EngineProcess", "WebView not found yet, retrying... (attempt $attempts/10)")
                        handler.postDelayed(this, 100) // Retry after 100ms
                    } else {
                        Log.w("EngineProcess", "Could not find WebView after 10 attempts")
                    }
                }
            }
        }
        handler.postDelayed(runnable, 500) // Start first attempt after 500ms
    }
    
    private fun findWebView(view: android.view.View): WebView? {
        if (view is WebView) {
            return view
        }
        if (view is android.view.ViewGroup) {
            for (i in 0 until view.childCount) {
                val child = view.getChildAt(i)
                val result = findWebView(child)
                if (result != null) {
                    return result
                }
            }
        }
        return null
    }
}