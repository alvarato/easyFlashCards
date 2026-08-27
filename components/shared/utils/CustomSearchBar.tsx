import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type CustomSearchBarProps<T> = {
  items: T[];
  searchKeys: (keyof T)[];
  onResults: (filtered: T[]) => void;
  placeholder?: string;
  initialValue?: string;
};

export default function CustomSearchBar<T>({
  items,
  searchKeys,
  onResults,
  placeholder = "Buscar...",
  initialValue = "",
}: CustomSearchBarProps<T>) {
  const [query, setQuery] = useState(initialValue);

  const filtrar = (texto: string) => {
    if (!texto.trim()) {
      onResults(items);
      return;
    }

    const normalizado = texto.trim().toLowerCase();

    const resultado = items.filter((item) =>
      searchKeys.some((key) => {
        const valor = item[key];
        return (
          typeof valor === "string" &&
          valor.toLowerCase().includes(normalizado)
        );
      }),
    );

    onResults(resultado);
  };

  const handleChange = (texto: string) => {
    setQuery(texto);
    filtrar(texto);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
      />
      <Pressable style={styles.searchButton} hitSlop={8}>
        <Ionicons
          name="search-outline"
          size={theme.spacing.l}
          color={theme.colors.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingLeft: theme.spacing.m,
    width: "100%",
    marginBottom:theme.spacing.m
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.s,
    fontSize: 16,
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  pressed: {
    opacity: 0.6,
  },
});