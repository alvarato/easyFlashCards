import { Pressable, StyleSheet, Text, View } from "react-native";

import { textStyles } from "@/styles/Texts";
import { globalStyles } from "../../../styles/Styles";
import { useAlert } from "../alerts/AlertProvider";

interface CustomDualButtonsProps {
  /** Texto del botón de confirmación */
  confirmText?: string;
  /** Acción al presionar confirmar */
  onConfirm: () => void;
  /** Texto del botón de cancelación */
  cancelText?: string;
  /** Acción al presionar cancelar */
  onCancel: () => void;
  /** ¿Muestra alerta antes de confirmar? */
  confirmAlert?: boolean;
  confirmAlertTitle?: string;
  confirmAlertMessage?: string;
  /** ¿Muestra alerta antes de cancelar? */
  cancelAlert?: boolean;
  cancelAlertTitle?: string;
  cancelAlertMessage?: string;
  /** Ocultar el componente completo */
  hidden?: boolean;
}

export default function CustomDualButtons({
  confirmText = "Aceptar",
  onConfirm,
  cancelText = "Cancelar",
  onCancel,
  confirmAlert = false,
  confirmAlertTitle = "Confirmar acción",
  confirmAlertMessage,
  cancelAlert = false,
  cancelAlertTitle = "Cancelar acción",
  cancelAlertMessage,
  hidden = false,
}: CustomDualButtonsProps) {
  const showAlert = useAlert();

  const handlePress = async (
    action: () => void,
    hasAlert: boolean,
    title: string,
    message?: string,
  ) => {
    if (!hasAlert) {
      action();
      return;
    }

    const confirm = await showAlert(title, message);
    if (confirm) {
      action();
    }
  };

  return (
    <View style={[styles.dualContainer, hidden && globalStyles.hidden]}>
      {/* Botón Cancelar (Secundario) */}
      <Pressable
        style={[globalStyles.genericButton45, globalStyles.bgSecondary]}
        onPress={() =>
          handlePress(
            onCancel,
            cancelAlert,
            cancelAlertTitle,
            cancelAlertMessage,
          )
        }
      >
        <Text style={textStyles.textPrimaryM}>{cancelText}</Text>
      </Pressable>

      {/* Botón Confirmar (Primario) */}
      <Pressable
        style={globalStyles.genericButton45}
        onPress={() =>
          handlePress(
            onConfirm,
            confirmAlert,
            confirmAlertTitle,
            confirmAlertMessage,
          )
        }
      >
        <Text style={textStyles.textPrimaryM}>{confirmText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dualContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 5,
    justifyContent: "space-between",
  },
});
