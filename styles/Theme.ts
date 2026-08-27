// src/theme/theme.ts

export const theme = {
  colors: {
    background: "#000000", // Negro puro
    surface: "#1A1A1A",
    //primary: "#5A189A",
    primary: "#007AFF",
    secondary: "#2a2a2a",
    tertiary: "#5A189A",
    //secondary: "#9D4EDD", // Morado vibrante (visto en botones)
    accent: "rgb(66, 125, 188)", // Morado muy claro (detalles o texto destacado)
    textPrimary: "#F9F6EE", // Blanco casi puro
    textSecondary: "#ADB5BD", // Gris para textos de ayuda/descripciones
    //error: '#FF4D4D',
    error: "#c62828",
    border: "#333333",
    good: "#2e7d32", // Gris sutil para separar elementos,
    pureWithe: "#ffffff",
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 36,
    xxl: 48,
  },
} as const; // "as const" hace que TS trate los valores como literales exactos

export type Theme = typeof theme;
