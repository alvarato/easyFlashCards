// CustomButtonIncrement.tsx
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, StyleSheet } from "react-native";

type CustomButtonIncrementProps = {
  onIncrement: () => void;
  label?: string;
  holdDelay?: number;    // delay antes de empezar a repetir
  repeatInterval?: number; // cada cuánto repite
  disabled?: boolean;
};

export default function CustomButtonIncrement({
  onIncrement,
  label = "+",
  disabled = false,
}: CustomButtonIncrementProps) {

    const holdDelay = 200;
    const repeatInterval = 300;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePressIn = () => {
    if (disabled) return;

    onIncrement(); // primer incremento inmediato

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onIncrement();
      }, repeatInterval);
    }, holdDelay);
  };

  const handlePressOut = () => {
    clearTimers();
  };

  return (
    <TouchableOpacity
      style={[globalStyles.incrementButton, label=="+" ? globalStyles.bgGreen:globalStyles.bgDanger]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={textStyles.textPrimaryM}>{label}</Text>
    </TouchableOpacity>
  );
}