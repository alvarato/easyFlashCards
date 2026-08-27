import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
  size?: number;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  size = 28,
}) => {
  // Valor de animación de 0 (desmarcado) a 1 (marcado)
  const animatedValue = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: checked ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: false, // Requerido false porque se animan colores de fondo
    }).start();
  }, [checked, animatedValue]);

  // Interpolación de colores usando tu tema
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", theme.colors.primary], // Fondo negro a morado oscuro
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.secondary], // Borde gris a morado vibrante
  });

  // Interpolación para el tamaño/escala del icono
  const iconScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={{ width: size, height: size }}
    >
      <Animated.View
        style={[
          styles.checkboxBase,
          {
            borderRadius: size / 4,
            backgroundColor,
            borderColor,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons
            name="checkmark"
            size={size * 0.75}
            color={theme.colors.accent} // Morado claro para máximo contraste
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
