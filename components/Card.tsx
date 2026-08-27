import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

type CardProps = {
  front: string;
  back: string | React.ReactNode;
};

export default function Card({ front, back }: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const flip = () => {
    Animated.spring(animation, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <Pressable onPress={flip} style={styles.container}>
      <Animated.View
        style={[styles.card, styles.cardFace, frontAnimatedStyle]}
        pointerEvents={flipped ? "none" : "auto"}
      >
        <Text style={textStyles.textSecondaryL}>{front}</Text>
      </Animated.View>

      <Animated.View
        style={[styles.card, styles.cardFace, backAnimatedStyle]}
        pointerEvents={flipped ? "auto" : "none"}
      >
        {typeof back === "string" ? (
          <Text style={textStyles.textSecondaryL}>{back}</Text>
        ) : (
          back
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  cardFace: {
    position: "absolute",
    backfaceVisibility: "hidden",
    width: "80%",
    height: "60%",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#1a1a1a",
  },
});