import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type CustomButtonIconProps = {
  onPress: () => void;
  text:string;
};

export default function CustomButtonText({
  onPress,
  text
}: CustomButtonIconProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      hitSlop={8}
    >
      <Text style={textStyles.textPrimaryM}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  pressed: {
    opacity: 0.6,
    backgroundColor:theme.colors.background,
  },
});