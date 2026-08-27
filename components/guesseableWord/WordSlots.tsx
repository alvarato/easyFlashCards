import { theme } from "@/styles/Theme";
import { StyleSheet, Text, View } from "react-native";
import { LineChar } from "./wordParser";

type WordSlotsProps = {
  lines: LineChar[][];
  value: string;
  letterColor: string;
  underlineColor: string;
};

export default function WordSlots({
  lines,
  value,
  letterColor,
  underlineColor,
}: WordSlotsProps) {
  return (
    <>
      {lines.map((line, lineIndex) => (
        <View key={lineIndex} style={styles.row}>
          {line.map(({ char, typedIndex }, i) => {
            if (typedIndex === null) {
              return (
                <View key={i} style={styles.slot}>
                  <Text style={styles.letter}>{char}</Text>
                </View>
              );
            }
            const typedChar = value[typedIndex];
            return (
              <View key={i} style={styles.slot}>
                <Text style={[styles.letter, { color: letterColor }]}>
                  {typedChar ?? ""}
                </Text>
                <View
                  style={[
                    styles.underline,
                    { backgroundColor: underlineColor },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  slot: {
    width: 20,
    alignItems: "center",
    marginHorizontal: 2,
    marginVertical: 4,
  },
  letter: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    height: 24,
  },
  underline: {
    width: 16,
    height: 2,
    backgroundColor: theme.colors.secondary,
    marginTop: 2,
  },
});
