import { theme } from "@/styles/Theme";
import { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
import { textStyles } from "@/styles/Texts";
import { globalStyles } from "@/styles/Styles";

type GuessableWordProps = {
  word: string;
  onComplete?: () => void;
  textCheck:string;
  textShowAnswer:string;
  handleFeedback:(result: boolean) =>void;
};

type FeedbackState = "idle" | "correct" | "incorrect";

export default function GuessableWord({
  word,
  onComplete,
  textCheck,
  textShowAnswer,
  handleFeedback
}: GuessableWordProps) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const inputRef = useRef<TextInput>(null);
  const feedbackRef = useRef<AnimatedFeedbackHandle>(null);
  const [firstTry, setFirstTry] = useState<boolean>(false);
  const [sendedFeedback, setSendedFeedback] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const chars = parseDisplayChars(word);
  const solutionWord = chars.map((c) => c.char).join("");
  const letterCount = chars.filter(isEditable).length;
  const lines = buildLines(chars);

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
    handleFeedback(false);
    setSendedFeedback(true);
    Keyboard.dismiss();
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
      handleFeedback(true);
      setSendedFeedback(true);
    } else {
      setFeedback("incorrect");
      feedbackRef.current?.shake();
    }
    setFirstTry(true);
    Keyboard.dismiss();
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
      ? theme.colors.good
      : feedback === "incorrect"
        ? theme.colors.error
        : theme.colors.textSecondary;
  const underlineColor = letterColor;

  return (
    <View>
      <AnimatedFeedback ref={feedbackRef} style={styles.container}>
        <View>
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
        {
          !sendedFeedback &&
          <GuessableWordActions
          onSend={handleSend}
          onShowAnswer={handleShowAnswer}
          firstTry={firstTry}
          textCheck={textCheck}
          textShowAnswer={textShowAnswer}
        />
        }
        
        {showAnswer && (
        <Text style={[textStyles.textSecondaryL,globalStyles.textCenter]}>{solutionWord}</Text>
      )}
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
});
