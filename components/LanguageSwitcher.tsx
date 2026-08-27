import { useTranslation } from "react-i18next";
import { OptionSelect } from "./Clases";
import { guardarConfig } from "./db/settingsDB";
import CustomSelect from "./shared/utils/CustomSelect";

const AVAILABLE_LANGUAGES: OptionSelect[] = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
  { label: "Italiano", value: "it" },
  { label: "Português", value: "pt" },
  { label: "Русский", value: "ru" },
];

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = (itemValue: string | number) => {
    i18n.changeLanguage(String(itemValue));
    guardarConfig({ language: String(itemValue) });
  };

  return (
    <CustomSelect
      text={t("select.choiceAnOption")}
      value={i18n.language}
      setValue={handleSelectLanguage}
      options={AVAILABLE_LANGUAGES}
    />
  );
}
