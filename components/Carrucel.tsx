import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CarruselProps = {
  items: ReactNode[];
  onlyRead?: boolean;
};

export type CarruselHandle = {
  goNext: () => void;
  goPrev: () => void;
  getIndex: () => number;
};

const Carrusel = forwardRef<CarruselHandle, CarruselProps>(
  ({ items, onlyRead = true }, ref) => {
    const [index, setIndex] = useState(0);
    const total = items.length;

    const goPrev = () => {
      setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const goNext = () => {
      setIndex((prev) => (prev < total - 1 ? prev + 1 : prev));
    };

    useImperativeHandle(ref, () => ({
      goNext,
      goPrev,
      getIndex: () => index,
    }));

    if (total === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>No hay elementos</Text>
        </View>
      );
    }

    return (
      <View style={globalStyles.containerNoPadding}>
        <View style={styles.content}>{items[index]}</View>

        {onlyRead && (
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
              style={[
                styles.button,
                index === total - 1 && styles.buttonDisabled,
              ]}
            >
              <Text style={textStyles.textSecondaryL}>{">"}</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }
);

Carrusel.displayName = "Carrusel";

export default Carrusel;

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1, width: "100%" },
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
  buttonDisabled: { backgroundColor: "#cccccc" },
  emptyText: { fontSize: 16, color: "#888888" },
});