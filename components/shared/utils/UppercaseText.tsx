// components/UppercaseText.tsx
import { Text, TextProps } from "react-native";

export function UppercaseText({ style, ...props }: TextProps) {
  return <Text style={[{ textTransform: "uppercase" }, style]} {...props} />;
}
