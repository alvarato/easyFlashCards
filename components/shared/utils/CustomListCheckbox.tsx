import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Tipo genérico para aceptar cualquier objeto { [key: string]: boolean }
export type CheckboxState = Record<string, boolean>;

interface CustomListCheckBoxProps<T extends CheckboxState> {
  title?: string;
  values: T;
  onChange: (key: keyof T, newValue: boolean) => void;
  /** Mapeo opcional para mostrar nombres legibles en la UI */
  labels?: Partial<Record<keyof T, string>>;
}

export default function CustomListCheckBox<T extends CheckboxState>({
  title,
  values,
  onChange,
  labels,
}: CustomListCheckBoxProps<T>) {
  const keys = Object.keys(values) as Array<keyof T>;

  if (keys.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[textStyles.textPrimaryM, styles.title]}>{title}</Text>
      )}

      <View style={styles.listContainer}>
        {keys.map((key, index) => {
          const isChecked = values[key];
          const isLast = index === keys.length - 1;
          const displayLabel = labels?.[key] ?? String(key);

          return (
            <React.Fragment key={String(key)}>
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => onChange(key, !isChecked)}
              >
                <Text style={[styles.label, isChecked && styles.labelChecked]}>
                  {displayLabel}
                </Text>

                <View
                  style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                >
                  {isChecked && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={theme.colors.accent}
                    />
                  )}
                </View>
              </Pressable>

              {!isLast && <View style={styles.separator} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: {
    backgroundColor: theme.colors.background,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.m,
    flex: 1,
  },
  labelChecked: {
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.m,
  },
});
