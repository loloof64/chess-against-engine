plugins {
    id("com.android.library")
    id("kotlin-android")
}

configurations {
    create("default") {
        isCanBeConsumed = true
        isCanBeResolved = false
    }
}

android {
    namespace = "com.loloof64.chessengines"
    compileSdk = 36

    defaultConfig {
        minSdk = 24
        targetSdk = 36
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }
}

repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("org.json:json:20230227")
    implementation("com.github.gkalab:chessenginesupport-androidlib:3")
}