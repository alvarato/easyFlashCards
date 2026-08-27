import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CarruselProps = {
  items: ReactNode[];
  random?: boolean;
};

// Función para mezclar el arreglo sin mutar el original
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Carrusel({ items, random = false }: CarruselProps) {
  const [index, setIndex] = useState(0);

  // Mezcla la lista solo cuando cambia 'items' o la prop 'random'
  const displayItems = useMemo(() => {
    return random ? shuffleArray(items) : items;
  }, [items, random]);

  const total = displayItems.length;

  const goPrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setIndex((prev) => (prev < total - 1 ? prev + 1 : prev));
  };

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No hay elementos</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.containerNoPadding}>
      <View style={styles.content}>{displayItems[index]}</View>

      <View style={styles.controls}>
        <Pressable
          onPress={goPrev}
          disabled={index === 0}
          style={[styles.button, index === 0 && styles.buttonDisabled]}
        >
          <Text style={textStyles.textSecondaryL}>{"<"}</Text>
        </Pressable>

        <Text style={textStyles.textSecondaryL}>
          {index + 1}/{total}
        </Text>

        <Pressable
          onPress={goNext}
          disabled={index === total - 1}
          style={[styles.button, index === total - 1 && styles.buttonDisabled]}
        >
          <Text style={textStyles.textSecondaryL}>{">"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 20,
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  counter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    minWidth: 50,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
  },
});
