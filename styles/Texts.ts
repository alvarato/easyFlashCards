import { StyleSheet, ViewStyle } from "react-native";
import { theme } from "./Theme";

export const textStyles = StyleSheet.create({
  // --- TEXT PRIMARY ---
  textPrimaryS: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.s,
    fontWeight: "bold",
  },
  textPrimaryM: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.m,
    fontWeight: "bold",
  },
  textPrimaryL: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.l,
    fontWeight: "bold",
  },
  textPrimaryXL: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.xl,
    fontWeight: "bold",
  },
  textPrimaryXXL: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.xxl,
    fontWeight: "bold",
  },

  // --- TEXT SECONDARY ---
  textSecondaryS: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.s,
    fontWeight: "bold",
  },
  textSecondaryM: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.m,
    fontWeight: "bold",
  },
  textSecondaryL: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.l,
    fontWeight: "bold",
  },
  textSecondaryXL: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.xl,
    fontWeight: "bold",
  },
  textSecondaryXXL: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.xxl,
    fontWeight: "bold",
  },
});
