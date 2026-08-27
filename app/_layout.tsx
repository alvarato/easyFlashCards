import "@/components/db/initDB"; // Garantiza DB lista

import { obtenerConfigs } from "@/components/db/settingsDB";
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

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [appLista, setAppLista] = useState(false);

  useEffect(() => {
    try {
      // 1. Ahora es seguro llamar a la DB porque la tabla 'settings' ya existe
      const config = obtenerConfigs();
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
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appLista]);

  if (!appLista) {
    return null;
  }

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
