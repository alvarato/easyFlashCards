import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface InitialSplashScreenProps {
  onFinish: () => void;
}

export const InitialSplashScreen: React.FC<InitialSplashScreenProps> = ({
  onFinish,
}) => {
  // Valores animados para opacidad y escala
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Ejecutamos ambas animaciones en paralelo durante exactamente 2000 ms (2 segundos)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true, // Optimizado para rendimiento nativo
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Callback al terminar los 2 segundos
      if (onFinish) {
        onFinish();
      }
    });
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")} // Ajusta la ruta de tu logo.png
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Cambia al color de fondo de tu app
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
});
