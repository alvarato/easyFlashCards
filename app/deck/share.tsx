import { deckToCsv } from "@/components/csv/Csvtodeck";
import CustomButtom from "@/components/shared/utils/CustomButtom";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type ShareMode = "menu" | "qr";

// Por encima de este largo de texto, el QR se vuelve poco confiable
// (lento de escanear, más errores de lectura). Ajustable según pruebas reales.
const MAX_QR_LENGTH = 800;

export default function ShareDeckScreen() {
  const { t } = useTranslation();
  const { id, deckName } = useLocalSearchParams<{
    id: string;
    deckName: string;
  }>();
  const [qrSize, setQrSize] = useState<number>(0);
  const [mode, setMode] = useState<ShareMode>("menu");

  const csvData = deckToCsv(Number(id));
  const isTooLargeForQR = (csvData?.length ?? 0) > MAX_QR_LENGTH;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const size = Math.min(width, height);
    if (size > 0 && size !== qrSize) {
      setQrSize(size);
    }
  };

  const handleExportCsv = async () => {
    if (!csvData) return;

    const fileName = `${(deckName ?? "deck").replace(/[^a-z0-9]/gi, "_")}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) return;

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: `${t("deck.shareDeck")} ${deckName}`,
      UTI: "public.comma-separated-values-text",
    });
  };

  if (!csvData) {
    return (
      <Text style={textStyles.textSecondaryL}>{t("deck.deckNotFound")}</Text>
    );
  }

  return (
    <View style={[globalStyles.container]}>
      <Stack.Screen
        options={{
          title: deckName,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.textSecondary,
        }}
      />

      {mode === "menu" && (
        <View style={[globalStyles.container, globalStyles.centerContent]}>
          {isTooLargeForQR && (
            <Text style={textStyles.textSecondaryL}>
              {t("deck.deckTooLargeForQR")}
            </Text>
          )}

          {!isTooLargeForQR && (
            <CustomButtom
              text={t("deck.shareAsQR")}
              onPress={() => setMode("qr")}
            />
          )}

          <CustomButtom text={t("deck.shareAsCsv")} onPress={handleExportCsv} />
        </View>
      )}

      {mode === "qr" && (
        <>
          {/* Contenedor flexible para el QR */}
          <View style={styles.qrWrapper} onLayout={handleLayout}>
            {qrSize > 0 && (
              <View style={styles.qrBorder}>
                <QRCode
                  value={csvData}
                  size={qrSize - styles.qrBorder.padding * 2}
                />
              </View>
            )}
          </View>
          <CustomButtom
            text={t("general.back") ?? "Volver"}
            onPress={() => setMode("menu")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  qrWrapper: {
    margin: "auto",
    flex: 1,
    width: "100%",
    maxWidth: 320, // Opcional: limita el tamaño máximo en pantallas grandes
    aspectRatio: 1, // Mantiene la proporción cuadrada
    marginTop: theme.spacing.m,
  },
  qrBorder: {
    backgroundColor: theme.colors.pureWithe,
    padding: 16,
    borderRadius: 8,
  },
});
