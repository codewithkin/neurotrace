import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { initI18n } from "@/lib/i18n";
import { getLanguageCode } from "@/lib/storage/app-storage";
import { checkForOtaUpdate } from "@/lib/updates/ota";
import { HeroUINativeProvider, Spinner } from "heroui-native";
import { View } from "react-native";

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkForOtaUpdate();
    initI18n(getLanguageCode())
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
