import { globalStyles } from "@/styles/Styles";
import { Asset } from "expo-asset";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { TFunction } from "i18next";
import React from "react";
import { View } from "react-native";
import { useAlert } from "./shared/alerts/AlertProvider";
import CustomButtom from "./shared/utils/CustomButton";

interface DownloadPromptButtonProps {
  t: TFunction;
}

export const DownloadPromptButton: React.FC<DownloadPromptButtonProps> = ({
  t,
}) => {
  const showAlert = useAlert();

  const handleDownloadPrompt = async () => {
    // 1. Pedir confirmación al usuario antes de proceder
    const confirmed = await showAlert(
      t("general.download.alertTitle"),
      t("general.download.alertMessage"),
    );

    if (!confirmed) return; // El usuario canceló

    try {
      const asset = Asset.fromModule(require("../prompt.txt"));
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("No se pudo obtener la ruta local del archivo.");
      }

      const sourceFile = new File(asset.localUri);
      const destinationFile = new File(Paths.document, "prompt.txt");

      if (destinationFile.exists) {
        destinationFile.delete();
      }

      await sourceFile.copy(destinationFile);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(destinationFile.uri, {
          mimeType: "text/plain",
          dialogTitle: t("general.download.dialogTitle") + " prompt.txt",
          UTI: "public.plain-text",
        });
      } else {
        await showAlert(
          t("general.success"),
          t(
            "download.successMessage",
            "El archivo prompt.txt ha sido guardado.",
          ),
        );
      }
    } catch (error) {
      console.error(error);
      await showAlert(t("general.error"), t("general.download.errorMessage"));
    }
  };

  const handleCopyPrompt = async () => {
    try {
      const asset = Asset.fromModule(require("../prompt.txt"));
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("No se pudo obtener la ruta local del archivo.");
      }
      const file = new File(asset.localUri);
      const textContent = await file.text();

      await Clipboard.setStringAsync(textContent);
    } catch (error) {
      console.error(error);
      await showAlert(t("general.error"), t("general.download.errorMessage"));
    }
  };

  return (
    <View style={globalStyles.flex1}>
      <CustomButtom
        text={t("general.copy.prompt")}
        onPress={handleCopyPrompt}
        alert={false}
      />
    </View>
  );
};

      // <CustomButtom
      //   text={t("general.download.prompt")}
      //   onPress={handleDownloadPrompt}
      //   // Desactivamos la alerta nativa del CustomButtom para manejarla con AlertProvider
      //   alert={false}
      // />