import java.util.Properties

plugins {
    id("com.android.application")
}

// App settings live in gradle.properties so the domain, ID and version are edited in one place.
val host = providers.gradleProperty("twa.host").get()
val appId = providers.gradleProperty("twa.applicationId").get()
val appName = providers.gradleProperty("twa.appName").get()

// Release signing comes from an untracked keystore.properties (see keystore.properties.example).
val keystoreFile = rootProject.file("keystore.properties")
val keystore = Properties().apply { if (keystoreFile.exists()) keystoreFile.inputStream().use(::load) }

android {
    namespace = "app.website"
    compileSdk = 36

    defaultConfig {
        applicationId = appId
        minSdk = 24
        targetSdk = 36
        versionCode = providers.gradleProperty("twa.versionCode").get().toInt()
        versionName = providers.gradleProperty("twa.versionName").get()

        manifestPlaceholders["hostName"] = host
        resValue("string", "appName", appName)
        resValue("string", "launchUrl", "https://$host/")
        // Must match the site's /.well-known/assetlinks.json for the app to run without a URL bar.
        resValue(
            "string",
            "assetStatements",
            "[{\\\"relation\\\": [\\\"delegate_permission/common.handle_all_urls\\\"], " +
                "\\\"target\\\": {\\\"namespace\\\": \\\"web\\\", \\\"site\\\": \\\"https://$host\\\"}}]",
        )
    }

    buildFeatures {
        resValues = true
    }

    signingConfigs {
        if (keystoreFile.exists()) {
            create("release") {
                storeFile = rootProject.file(keystore.getProperty("storeFile"))
                storePassword = keystore.getProperty("storePassword")
                keyAlias = keystore.getProperty("keyAlias")
                keyPassword = keystore.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        // Test builds install alongside the store app and may open any URL, e.g. a computer on the
        // office network: ./gradlew assembleDebug -Ptwa.testUrl=http://192.168.1.10:3000/
        debug {
            applicationIdSuffix = ".test"
            versionNameSuffix = "-test"
            resValue("string", "appName", "$appName Test")
            providers.gradleProperty("twa.testUrl").orNull?.let { resValue("string", "launchUrl", it) }
        }
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
            signingConfig = signingConfigs.findByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.4")
}

// Refuse to produce a store build that still points at the placeholder domain.
tasks.matching { it.name == "bundleRelease" || it.name == "assembleRelease" }.configureEach {
    val placeholder = host.endsWith("example.com")
    doFirst {
        check(!placeholder) { "Set twa.host in android/gradle.properties to the live website domain first." }
    }
}
