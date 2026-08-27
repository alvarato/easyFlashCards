import { theme } from "@/styles/Theme";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import AnimatedFeedback, {
    AnimatedFeedbackHandle,
} from "../AnimatedFeedbackHandle";
import GuessableWordActions from "./GuessableWordActions";
import {
    buildLines,
    fillWord,
    isEditable,
    parseDisplayChars,
} from "./wordParser";
import WordSlots from "./WordSlots";

type GuessableWordProps = {
  word: string;
  onComplete?: () => void;
};

type FeedbackState = "idle" | "correct" | "incorrect";

export default function GuessableWord({
  word,
  onComplete,
}: GuessableWordProps) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const inputRef = useRef<TextInput>(null);
  const feedbackRef = useRef<AnimatedFeedbackHandle>(null);
  const [firstTry, setFirstTry] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const chars = parseDisplayChars(word);
  const solutionWord = chars.map((c) => c.char).join("");
  const letterCount = chars.filter(isEditable).length;
  const lines = buildLines(chars);

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleChangeText = (text: string) => {
    setValue(text.slice(0, letterCount));
    if (feedback !== "idle") setFeedback("idle");
  };

  const handleSend = () => {
    const guessedFull = fillWord(chars, value);
    const correct = guessedFull.toLowerCase() === solutionWord.toLowerCase();

    if (correct) {
      setFeedback("correct");
      feedbackRef.current?.success();
      onComplete?.();
    } else {
      setFeedback("incorrect");
      feedbackRef.current?.shake();
    }
    setFirstTry(true);
  };

  // Fuerza que el teclado se reabra aunque el TextInput ya estuviera "focuseado"
  // internamente pero con el teclado cerrado (ej. tras tocar "send").
  const handlePressWord = () => {
    inputRef.current?.blur();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const letterColor =
    feedback === "correct"
      ? "#2e7d32"
      : feedback === "incorrect"
        ? "#c62828"
        : theme.colors.textSecondary;
  const underlineColor = letterColor;

  return (
    <View>
      <AnimatedFeedback ref={feedbackRef} style={styles.container}>
        <View style={styles.boxButtons}>
          <Pressable onPress={handlePressWord}>
            <WordSlots
              lines={lines}
              value={value}
              letterColor={letterColor}
              underlineColor={underlineColor}
            />
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={handleChangeText}
              maxLength={letterCount}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.hiddenInput}
            />
          </Pressable>
        </View>

        <GuessableWordActions
          onSend={handleSend}
          onShowAnswer={handleShowAnswer}
          firstTry={firstTry}
          showAnswer={showAnswer}
          solutionWord={solutionWord}
        />
      </AnimatedFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
  boxButtons: {
    width: "100%",
  },
});
