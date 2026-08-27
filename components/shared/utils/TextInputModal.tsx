import CustomButton from "@/components/shared/utils/CustomButton";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import CustomDualButtons from "./CustomDualButtons";

interface TextInputModalProps {
  /** Controla la visibilidad del modal */
  visible: boolean;
  /** Título principal del modal */
  title: string;
  /** Texto de ayuda para el input */
  placeholder?: string;
  /** Valor inicial opcional del texto */
  initialValue?: string;
  /** Texto del botón de cancelar */
  cancelText?: string;
  /** Texto del botón de confirmar */
  confirmText?: string;
  /** Texto del botón de pegar */
  pasteText?: string;
  /** Callback al cancelar o cerrar */
  onCancel: () => void;
  /** Callback al confirmar con el texto ingresado */
  onSubmit: (text: string) => void;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({
  visible,
  title,
  placeholder,
  initialValue = "",
  cancelText = "Cancelar",
  confirmText = "Aceptar",
  pasteText = "Pegar del portapapeles",
  onCancel,
  onSubmit,
}) => {
  const [text, setText] = useState<string>(initialValue);

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setText(clipboardText);
    }
  };

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  const handleClose = () => {
    onCancel();
    setText("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.pasteButtonContainer}>
            <CustomButton
              text={`📋 ${pasteText}`}
              onPress={handlePaste}
              secondary
            />
          </View>

          <TextInput
            style={styles.textArea}
            multiline
            placeholder={placeholder}
            placeholderTextColor="#777"
            value={text}
            onChangeText={setText}
          />
          <CustomDualButtons
            onCancel={handleClose}
            onConfirm={handleSubmit}
            cancelText={cancelText}
            confirmText={confirmText}
          ></CustomDualButtons>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  pasteButtonContainer: {
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: "#121212",
    color: "#ffffff",
    borderRadius: 10,
    padding: 12,
    height: 150,
    textAlignVertical: "top",
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 16,
  },
});
