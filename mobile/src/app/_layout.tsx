import { InstrumentSerif_400Regular_Italic } from "@expo-google-fonts/instrument-serif";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SiteProvider, useSite } from "../lib/site";
import { colors } from "../lib/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    InstrumentSerif_400Regular_Italic,
  });
  return (
    <SafeAreaProvider>
      <SiteProvider>
        <App ready={fontsLoaded || !!fontError} />
      </SiteProvider>
    </SafeAreaProvider>
  );
}

// Keeps the splash screen up until fonts and the site settings (or saved copy) are ready.
function App({ ready }: { ready: boolean }) {
  const { site, failed, refresh } = useSite();
  const insets = useSafeAreaInsets();
  const settled = ready && (!!site || failed);
  useEffect(() => {
    if (settled) SplashScreen.hideAsync().catch(() => {});
  }, [settled]);
  if (!settled) return null;
  if (!site) return <FirstLaunchOffline onRetry={refresh} />;
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      />
      {/* Screens scroll under the status bar; this keeps its icons readable. */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: colors.navy,
        }}
      />
    </>
  );
}

// Interface text comes from the website, so the very first launch needs a connection.
function FirstLaunchOffline({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.navy,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 16,
      }}
    >
      <StatusBar style="light" />
      <Ionicons name="cloud-offline-outline" size={44} color={colors.mint} />
      <Text style={{ color: colors.white, fontSize: 22, fontWeight: "700" }}>
        You’re offline
      </Text>
      <Text style={{ color: colors.mist, textAlign: "center", lineHeight: 22 }}>
        Connect to the internet once to load the app. After that, content is
        saved for offline use.
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={{
          marginTop: 8,
          backgroundColor: colors.mint,
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}
      >
        <Text style={{ color: colors.navy, fontWeight: "700" }}>Try again</Text>
      </Pressable>
    </View>
  );
}
