import "@/components/db/initDB";

import i18n from "@/i18n";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { View } from "react-native";
import "react-native-reanimated";

import { AlertProvider } from "@/components/shared/alerts/AlertProvider";
import { theme } from "@/styles/Theme";
import SplashLogo from "@/components/SplashLogo";
import { getSettings } from "@/components/db/settingsDB";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [appLista, setAppLista] = useState(false);
  const [splashTerminado, setSplashTerminado] = useState(false);

  useEffect(() => {
    try {
      const config = getSettings();
      if (config?.language) {
        i18n.changeLanguage(config.language);
      }
    } catch (e) {
      console.warn("Error leyendo configuración de idioma:", e);
    } finally {
      setAppLista(true);
    }
  }, []);

  useEffect(() => {
    if (appLista) {
      // Oculta el splash NATIVO de expo apenas la data está lista
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appLista]);

  // 1. Mientras carga la config, no renderiza nada (splash nativo sigue visible)
  if (!appLista) {
    return null;
  }

  // 2. Config lista pero tu splash animado (JS) todavía no terminó
  if (!splashTerminado) {
    return (
      <SplashLogo
        duration={3000}
        onFinish={() => setSplashTerminado(true)}
      />
    );
  }

  // 3. Splash terminado -> app normal
  return (
    <I18nextProvider i18n={i18n}>
      <AlertProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
        </View>
      </AlertProvider>
    </I18nextProvider>
  );
}