import { csvToDeck } from "@/components/csv/Csvtodeck";
import { useAlert } from "@/components/shared/alerts/AlertProvider";
import CustomButtom from "@/components/shared/utils/CustomButton";
import QuickForm from "@/components/shared/utils/QuickForm";
import ScanQR from "@/components/shared/utils/ScanQR";
import { TextInputModal } from "@/components/shared/utils/TextInputModal";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

type ImportMode = "menu" | "scanning" | "form" | "manual";

export default function NewDeckScreen() {
  const [qr, setQr] = useState<string | null>(null);
  const [flag, setFlag] = useState<boolean>(false);
  const [mode, setMode] = useState<ImportMode>("menu");
  const [manualText, setManualText] = useState<string>("");

  const { t } = useTranslation();
  const showAlert = useAlert();

  const createDeck = (data: string[]) => {
    if (qr != null) {
      csvToDeck(qr, data[0]);
      setFlag(true);
    }
  };

  const createDeckWithTitleDefault = async (title: string, csv: string) => {
    setQr(csv);
    const confirm = await showAlert(`${t("newDeck.createDeck")} ${title}`);
    if (confirm) {
      csvToDeck(csv, title);
      setFlag(true);
      setMode("form"); // muestra la vista de "deck creado"
    } else {
      cleanVars(); // vuelve al menú inicial
    }
  };

  const cancelDeck = async () => {
    await showAlert(`${t("newDeck.askCancelDeck")}`);
    setFlag(true);
  };

  const cleanVars = () => {
    setQr(null);
    setFlag(false);
    setMode("menu");
    setManualText("");
  };

  // Lógica genérica de parseo: la usan el QR, el CSV y la entrada manual
  const readQR = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const firstColumn = trimmedText.indexOf("\n");

    // Si no hay saltos de línea, procesa solo esa línea
    const firstLine =
      firstColumn !== -1 ? trimmedText.substring(0, firstColumn) : trimmedText;
    const restLines =
      firstColumn !== -1 ? trimmedText.substring(firstColumn + 1) : "";

    if (firstLine.split(",")[0] === "title") {
      createDeckWithTitleDefault(firstLine.split(",")[1], restLines);
    } else {
      setQr(trimmedText);
      setMode("form");
    }
  };

  const readCsv = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/comma-separated-values", "text/plain"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const { uri } = result.assets[0];
    const response = await fetch(uri);
    const csvContent = await response.text();

    readQR(csvContent);
  };

  const handleScanQR = () => {
    setMode("scanning");
  };

  // --- Pantalla inicial: elegir método de importación ---
  if (mode === "menu") {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <CustomButtom text={t("newDeck.scanQR")} onPress={handleScanQR} />
        <CustomButtom text={t("newDeck.readCsv")} onPress={readCsv} />
        <CustomButtom
          text={t("newDeck.manualInput")}
          onPress={() => setMode("manual")}
        />
      </View>
    );
  }

  // --- Pantalla de escaneo (mientras se usa la cámara) ---
  if (mode === "scanning") {
    return<View style={globalStyles.container}>
      <View style={globalStyles.flex1}>
      <ScanQR onScan={readQR} t={t} />
      </View>
      <CustomButtom text={t('general.back')}
        onPress={cleanVars}
      ></CustomButtom>
    </View>
     ;
  }

  // --- Modal para escribir o pegar texto a mano ---
  if (mode === "manual") {
    return (
      <TextInputModal
        visible={true}
        title={t("newDeck.insertDeckContent")}
        placeholder={"newDeck.exampleNewDeck"}
        initialValue=""
        cancelText={t("general.cancel")}
        confirmText={t("general.accept")}
        pasteText={t("newDeck.pasteClipboard")}
        onCancel={cleanVars}
        onSubmit={(text) => readQR(text)}
      ></TextInputModal>
    );
  }

  // --- Formulario / resultado tras leer QR, CSV o Texto Manual ---
  return (
    <View style={globalStyles.container}>
      {!flag ? (
        <QuickForm
          fields={["nameDeck"]}
          title={t("newDeck.form.title")}
          onSubmit={createDeck}
          onCancel={cancelDeck}
          t={t}
        />
      ) : (
        <View>
          <Text style={textStyles.textPrimaryXL}>
            {t("newDeck.deckCreated")}
          </Text>
          <CustomButtom text={t("newDeck.newDeck")} onPress={cleanVars} />
        </View>
      )}
    </View>
  );
}

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
  pasteButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  pasteButtonText: {
    color: "#007AFF",
    fontWeight: "600",
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#2a2a2a",
  },
  submitBtn: {
    backgroundColor: "#007AFF",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
