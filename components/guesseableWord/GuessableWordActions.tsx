import { textStyles } from "@/styles/Texts";
import { StyleSheet, Text, View } from "react-native";
import CustomButtom from "../shared/utils/CustomButtom";

type GuessableWordActionsProps = {
  onSend: () => void;
  onShowAnswer: () => void;
  firstTry: boolean;
  showAnswer: boolean;
  solutionWord: string;
};

export default function GuessableWordActions({
  onSend,
  onShowAnswer,
  firstTry,
  showAnswer,
  solutionWord,
}: GuessableWordActionsProps) {
  return (
    <View style={styles.boxButtons}>
      <CustomButtom text="send" onPress={onSend} />
      {firstTry && <CustomButtom text="show Answerd" onPress={onShowAnswer} />}
      {showAnswer && (
        <Text style={textStyles.textSecondaryL}>{solutionWord}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  boxButtons: {
    width: "100%",
  },
});
