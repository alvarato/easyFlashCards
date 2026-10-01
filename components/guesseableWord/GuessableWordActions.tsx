import { View } from "react-native";
import CustomButtom from "../shared/utils/CustomButton";

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
