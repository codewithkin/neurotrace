import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { getDeviceLanguage } from "@/lib/i18n/device-locale";
import { initI18n } from "@/lib/i18n";
import {
  getLanguageCode,
  setLanguageCode,
} from "@/lib/storage/app-storage";
import { syncRemoveAdsState } from "@/lib/purchases/remove-ads";
import { checkForOtaUpdate } from "@/lib/updates/ota";
import { HeroUINativeProvider, Spinner } from "heroui-native";
import { View } from "react-native";

function resolveInitialLanguage(): string {
  const stored = getLanguageCode();
  if (stored) return stored;
  // First launch: match the device locale and persist the choice.
  const detected = getDeviceLanguage();
  setLanguageCode(detected);
  return detected;
}

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkForOtaUpdate();
    syncRemoveAdsState();
    initI18n(resolveInitialLanguage())
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" />
      </View>
    );
  }
  return <>{children}</>;
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <StatusBar style="auto" />
            <BootstrapGate>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="assessment/part-a" />
                <Stack.Screen name="assessment/part-b" />
                <Stack.Screen name="results" />
                <Stack.Screen name="report" options={{ presentation: "modal" }} />
              </Stack>
            </BootstrapGate>
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
