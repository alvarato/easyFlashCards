import AnimatedFeedback, {
  AnimatedFeedbackHandle,
} from "@/components/AnimatedFeedbackHandle";
import {
  guardarConfig,
  obtenerConfigs,
  Settings,
} from "@/components/db/settingsDB";
import { DownloadPromptButton } from "@/components/DownloadPromptButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import CustomButtom from "@/components/shared/utils/CustomButton";
import CustomListCheckBox from "@/components/shared/utils/CustomListCheckbox";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

// Helper para filtrar solo las propiedades booleanas de Settings
const getCheckboxValues = (settings: Settings): Record<string, boolean> => {
  const result: Record<string, boolean> = {};

  (Object.keys(settings) as Array<keyof Settings>).forEach((key) => {
    if (typeof settings[key] === "boolean") {
      result[key] = settings[key] as boolean;
    }
  });

  return result;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const feedbackRef = useRef<AnimatedFeedbackHandle>(null);

  const loadSettings = (): Settings => {
    return obtenerConfigs();
  };

  const [settings, setSettings] = useState<Settings>(loadSettings);

  const saveSettings = () => {
    if (settings) {
      guardarConfig({ random: settings.random, read: settings.read });
      feedbackRef.current?.success();
    }
  };

  const handleChange = (key: string, newValue: boolean) => {
    const settingsKey = key as keyof Settings;
    setSettings((prev) => ({ ...prev, [settingsKey]: newValue }));
  };

  const checkboxValues = getCheckboxValues(settings);

  return (
    <AnimatedFeedback ref={feedbackRef} style={globalStyles.container}>
      {settings && (
        <>
          <Text style={textStyles.textPrimaryL}>
            {t("settings.cards.title")}
          </Text>
          <CustomListCheckBox
            values={checkboxValues}
            onChange={handleChange}
            labels={{
              random: t("settings.cards.random"),
              read: t("settings.cards.read"),
              advance: t("settings.cards.advance"),
            }}
          />
        </>
      )}
      <Text style={textStyles.textPrimaryL}>{t("settings.languages")}</Text>
      <LanguageSwitcher />
      <DownloadPromptButton t={t} />

      <View style={globalStyles.bottomContainer}>
        <CustomButtom text={t("general.save")} onPress={saveSettings} />
      </View>
    </AnimatedFeedback>
  );
}
