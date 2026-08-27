import { TFunction } from "i18next";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type QuickFormProps = {
  fields: string[]; // ej: ["Nombre", "Apellido", "Email"]
  initialValues?: string[]; // valores preescritos para los campos (opcional)
  maxLength?: number; // máximo de caracteres para todos los campos
  title?: string;
  onSubmit: (data: string[]) => void; // valores en el mismo orden que `fields`
  onCancel: () => void;
  t: TFunction;
};

export default function QuickForm({
  fields,
  initialValues = [],
  maxLength = 50,
  title = "Completa los datos",
  onSubmit,
  onCancel,
  t,
}: QuickFormProps) {
  // Inicializa con los valores recibidos o cadenas vacías
  const [values, setValues] = useState<string[]>(
    fields.map((_, index) => initialValues[index] ?? ""),
  );
  const [errors, setErrors] = useState<boolean[]>(fields.map(() => false));

  const handleChange = (index: number, text: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
    if (errors[index] && text.trim().length > 0) {
      setErrors((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors = values.map((v) => v.trim().length === 0);

    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          {fields.map((field, index) => (
            <View key={field} style={styles.fieldWrapper}>
              <Text style={styles.label}>
                {t(`quickForm.fields.${field}`)}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors[index] && styles.inputError]}
                value={values[index]}
                onChangeText={(text) => handleChange(index, text)}
                maxLength={maxLength}
                placeholder={field}
                placeholderTextColor="#999"
              />
              {errors[index] && (
                <Text style={styles.errorText}>{t("quickForm.")}</Text>
              )}
            </View>
          ))}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{t("general.cancel")}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>{t("general.accept")}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  required: {
    color: "#e53935",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
  },
  inputError: {
    borderColor: "#e53935",
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: "#111",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
