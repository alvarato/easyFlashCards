// src/theme/globalStyles.ts
import { StyleSheet, ViewStyle } from "react-native";
import { theme } from "./Theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    color: theme.colors.primary,
    width: "100%",
  } as ViewStyle,
  containerNoPadding: {
    flex: 1,
    width: "100%",
  } as ViewStyle,
  flex1: {
    flex: 1,
  } as ViewStyle,
  bottomContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: "flex-end", // Empuja el contenido hacia el fondo
  },
  centerContent: {
    justifyContent: "center",
  } as ViewStyle,
  textCenter:{
    textAlign:"center"
  },
  genericViewButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingButtom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  } as ViewStyle,
  genericButton: {
    borderColor: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: theme.spacing.s,
    margin: theme.spacing.s,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.m,
    width: "90%",
  } as ViewStyle,
  genericButton45: {
    borderColor: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    padding: theme.spacing.s,
    borderRadius: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    width: "45%",
  } as ViewStyle,
  circleButton: {
    borderColor: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    margin: theme.spacing.s,
    fontSize: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.m,
    width: "50%",
  } as ViewStyle,
  incrementButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  bgWithe: {
    backgroundColor: theme.colors.pureWithe,
  },
  bgDanger: {
    backgroundColor: theme.colors.error,
  },
  bgGreen: {
    backgroundColor: theme.colors.good,
  },
  bgPrimary: {
    backgroundColor: theme.colors.primary,
  },
  bgSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  hidden: {
    display: "none", // Aquí aplicas el "display none"
  },
  viewQR: {
    backgroundColor: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  } as ViewStyle,
  iconButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
  },
  paddingBottom20: {
    paddingBottom:20,
  }as ViewStyle,
  bottomContainerH15: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "25%",
  },
});
