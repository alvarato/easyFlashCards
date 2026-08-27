import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        // 1. Estilos para la barra superior (Header)
        headerStyle: {
          backgroundColor: theme.colors.background, // Fondo del header
          shadowColor: "transparent", // Quita sombra/línea en iOS
          elevation: 0, // Quita sombra en Android
        },
        headerTintColor: theme.colors.textSecondary, // Color del texto del título
        headerTitleStyle: {
          color: theme.colors.textSecondary, // Asegura el color en el título
        },

        // 2. Estilos para la barra inferior (Tab Bar)
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.primary,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home.navigation"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newDeck"
        options={{
          title: t("newDeck.navigation"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "create" : "create-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.navigation"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
