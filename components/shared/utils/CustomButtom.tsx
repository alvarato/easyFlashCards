import { Pressable, Text, View } from "react-native";

import { textStyles } from "@/styles/Texts";
import { globalStyles } from "../../../styles/Styles";
import { useAlert } from "../alerts/AlertProvider";

/**
 * `CustomButton` - Componente de botón versátil con soporte para alertas.
 */
interface Props {
  /** principal text */
  text: string;
  /** action of button */
  onPress: () => void;
  /** has alert? null == false*/
  alert?: boolean;
  /** title alert*/
  alertTitle?: string;
  /** message alert */
  alertMessage?: string;
  /** true == hidden */
  hidden?: boolean;
  /** change principal color to secondary background */
  secondary?: boolean;
  /** change principal color to danger background */
  colorDanger?: boolean;
  /** circle format button */
  circle?: boolean;

  /** action of button if we longPress */
  onLongPress?: () => void;
  /** has alert? null == false*/
  onLongAlert?: boolean;
  /** title alert*/
  onLongAlertTitle?: string;
  /** message alert */
  onLongAlertMessage?: string;
}

export default function CustomButton({
  text,
  alert,
  onPress,
  alertTitle,
  alertMessage,
  hidden,
  secondary,
  colorDanger,
  circle,
  onLongPress,
  onLongAlert,
  onLongAlertTitle,
  onLongAlertMessage,
}: Props) {
  const showAlert = useAlert();

  const checkUseAlert = (flag: boolean | undefined): boolean => {
    return flag == undefined || !flag;
  };

  const throwFunction = async () => {
    if (checkUseAlert(alert)) onPress();
    else {
      const confirm = await showAlert(
        alertTitle != null ? alertTitle : "Aceptar",
        alertMessage,
      );
      if (confirm) onPress();
    }
  };

  const throwLongPressFunction = async () => {
    if (onLongPress == undefined) return;
    if (checkUseAlert(onLongAlert)) onLongPress();
    else {
      const confirm = await showAlert(
        onLongAlertTitle != null ? onLongAlertTitle : "Aceptar",
        onLongAlertMessage,
      );
      if (confirm) onLongPress();
    }
  };

  return (
    <View
      style={[hidden && globalStyles.hidden, globalStyles.genericViewButton]}
    >
      <Pressable
        style={[
          !circle ? globalStyles.genericButton : globalStyles.circleButton,
          secondary && globalStyles.bgSecondary,
          colorDanger && globalStyles.bgDanger,
        ]}
        onPress={throwFunction}
        onLongPress={throwLongPressFunction}
      >
        <Text style={textStyles.textPrimaryM}>{text}</Text>
      </Pressable>
    </View>
  );
}
