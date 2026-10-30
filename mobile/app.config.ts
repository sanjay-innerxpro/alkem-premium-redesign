/// <reference types="node" />
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ExpoConfig } from "expo/config";

// App name, store ID and website domain come from android/gradle.properties, so a rename
// or domain change is made in one place for both Android apps (see android/README.md).
const props = Object.fromEntries(
  readFileSync(join(__dirname, "../android/gradle.properties"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("twa."))
    .map((line) => line.split("=").map((part) => part.trim())),
);
const name = props["twa.appName"];
const applicationId = props["twa.applicationId"];

const config: ExpoConfig = {
  name,
  slug: "website-app",
  scheme: applicationId,
  // Replaces the web-wrapper app on Google Play as its next version, so versionCode must be
  // higher than the one the wrapper last shipped with (twa.versionCode).
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  backgroundColor: "#fcfbf8",
  android: {
    package: applicationId,
    versionCode: Number(props["twa.versionCode"]) + 1,
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-image",
    "expo-status-bar",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 112,
        backgroundColor: "#071526",
      },
    ],
  ],
  extra: { siteUrl: `https://${props["twa.host"]}` },
};

export default config;
