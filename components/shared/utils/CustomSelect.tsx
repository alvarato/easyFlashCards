import { OptionSelect } from "@/components/Clases";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  text: string;
  value: string | number;
  setValue: (itemValue: string | number) => void;
  options: OptionSelect[];
}
// HOW TO USE -> Generate Options
// const generateOptions = (sizeList: number): OptionSelect[] => {
//   let options: OptionSelect[] = [];
//   return options;
// };

// UseState
// const [selectValue, setSelectValue] = useState<number | string>(1);
// const [selectOptions, setSelectOptions] = useState<OptionSelect[]>([]);;

{
  /* <CustomSelect 
        value={selectValue}
        setValue={setSelectValue}
        text={t("select.choiceAnOption")}
        options={selectOptions}
      />
      */
}
export default function CustomSelect({
  text,
  value,
  setValue,
  options,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!options || options.length === 0) {
    return null;
  }

  const selectedOption = options.find((item) => item.value === value);

  const handleSelect = (itemValue: string | number) => {
    setValue(itemValue);
    setIsOpen(false);
  };

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.selectBox,
          pressed && styles.selectBoxPressed,
        ]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.selectText} numberOfLines={1}>
          {selectedOption?.label ?? "Seleccionar..."}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[textStyles.textPrimaryM, styles.sheetTitle]}>
              {text}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              style={styles.list}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      pressed && styles.optionRowPressed,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectBox: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectBoxPressed: {
    borderColor: theme.colors.secondary,
  },
  selectText: {
    color: theme.colors.textPrimary,
    fontSize: theme.spacing.m,
    flex: 1,
  },
  chevron: {
    color: theme.colors.accent,
    fontSize: theme.spacing.l,
    lineHeight: 22,
    marginLeft: theme.spacing.s,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    maxHeight: "60%",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sheetTitle: {
    marginBottom: theme.spacing.s,
  },
  list: {
    marginTop: theme.spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  optionRow: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  optionRowSelected: {
    backgroundColor: theme.colors.background,
  },
  optionRowPressed: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.spacing.m,
  },
  optionTextSelected: {
    color: theme.colors.accent,
    fontWeight: "600",
  },
  checkmark: {
    color: theme.colors.secondary,
    fontSize: theme.spacing.m,
  },
});
