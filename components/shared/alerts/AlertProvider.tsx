import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. Contexto y tipo de función para mostrar la alerta
const AlertContext = createContext<
  (title: string, message?: string, showCancel?: boolean) => Promise<boolean>
>(() => Promise.resolve(false));

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  const [alert, setAlert] = useState<{
    title: string;
    message?: string;
    showCancel: boolean;
    resolve: (v: boolean) => void;
  } | null>(null);

  const showAlert = (
    title: string,
    message?: string,
    showCancel: boolean = true
  ): Promise<boolean> => {
    return new Promise((resolve) =>
      setAlert({ title, message, showCancel, resolve })
    );
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}

      {/* Modal personalizado */}
      <Modal visible={!!alert} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{alert?.title}</Text>

            {alert?.message ? (
              <Text style={styles.message}>{alert.message}</Text>
            ) : null}

            {/* Contenedor de botones en fila */}
            <View style={styles.buttonRow}>
              {alert?.showCancel !== false && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelBtn]}
                  activeOpacity={0.7}
                  onPress={() => {
                    alert?.resolve(false);
                    setAlert(null);
                  }}
                >
                  <Text style={styles.cancelText}>{t("general.cancel")}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.confirmBtn]}
                activeOpacity={0.7}
                onPress={() => {
                  alert?.resolve(true);
                  setAlert(null);
                }}
              >
                <Text style={styles.confirmText}>{t("general.accept")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    color: "#b0b0b0",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#444",
  },
  confirmBtn: {
    backgroundColor: "#007AFF",
  },
  cancelText: {
    color: "#e5e5e5",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});