import AnimatedFeedback, {
  AnimatedFeedbackHandle,
} from "@/components/AnimatedFeedbackHandle";
import {
  saveConfig,
  getSettings,
  Settings,
} from "@/components/db/settingsDB";
import { DownloadPromptButton } from "@/components/DownloadPromptButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import CustomListCheckBox from "@/components/shared/utils/CustomListCheckbox";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

// Helper to filter only the boolean properties of Settings
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
    return getSettings();
  };

  const [settings, setSettings] = useState<Settings>(loadSettings);

  const handleChange = (key: string, newValue: boolean) => {
    const settingsKey = key as keyof Settings;

    setSettings((prev) => {
      const updated = { ...prev, [settingsKey]: newValue };

      saveConfig({
        random: updated.random,
        read: updated.read,
        advance: updated.advance,
      });
      feedbackRef.current?.success();

      return updated;
    });
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
    </AnimatedFeedback>
  );
}