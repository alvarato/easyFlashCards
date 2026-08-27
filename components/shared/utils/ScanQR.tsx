import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { TFunction } from "i18next";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButtom from "./CustomButtom";
interface Props {
  onScan: (data: string) => void;
  t: TFunction;
}

export default function ScanQR({ onScan, t }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // 1. Si los permisos aún están cargando
  if (!permission) return <View />;

  // 2. Si no tenemos permisos, mostramos solo el botón
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>Necesitamos acceso a la cámara</Text>
        <CustomButtom
          text={t("general.getCameraPermiss")}
          onPress={requestPermission}
        />
      </View>
    );
  }

  // 3. Si tenemos permisos, mostramos la cámara
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }: BarcodeScanningResult) => {
          onScan(data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
  },
});
