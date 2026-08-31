import { textStyles } from "@/styles/Texts";
import { StyleSheet, Text, View } from "react-native";
import CustomButtom from "../shared/utils/CustomButton";
import { globalStyles } from "@/styles/Styles";

type GuessableWordActionsProps = {
  onSend: () => void;
  onShowAnswer: () => void;
  firstTry: boolean;
  textCheck:string;
  textShowAnswer:string;
};

export default function GuessableWordActions({
  onSend,
  onShowAnswer,
  firstTry,
  textCheck,
  textShowAnswer,
}: GuessableWordActionsProps) {
  return (
    <View>
           <CustomButtom text={textCheck} onPress={onSend} />
     
      {firstTry   &&
      <CustomButtom text={textShowAnswer} onPress={onShowAnswer} />}
      
    </View>
  );
}
