import { textStyles } from "@/styles/Texts";
import { StyleSheet, Text, View } from "react-native";
import CustomButtom from "../shared/utils/CustomButton";
import { globalStyles } from "@/styles/Styles";

type GuessableWordActionsProps = {
  onSend: () => void;
  onShowAnswer: () => void;
  firstTry: boolean;
  showAnswer: boolean;
  solutionWord: string;
  textCheck:string;
  textShowAnswer:string;
};

export default function GuessableWordActions({
  onSend,
  onShowAnswer,
  firstTry,
  showAnswer,
  solutionWord,
  textCheck,
  textShowAnswer
}: GuessableWordActionsProps) {
  return (
    <View>
      <CustomButtom text={textCheck} onPress={onSend} />
      {firstTry && <CustomButtom text={textShowAnswer} onPress={onShowAnswer} />}
      {showAnswer && (
        <Text style={[textStyles.textSecondaryL,globalStyles.textCenter]}>{solutionWord}</Text>
      )}
    </View>
  );
}
