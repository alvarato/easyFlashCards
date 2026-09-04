import { alertListItemButton, ObjetcIdValue } from "@/components/Clases";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAlert } from "../alerts/AlertProvider";
import CustomButtonIcon from "./CustomButtonIcon";
import CustomButtonText from "./CustomButtonText";
import { useState } from "react";

interface Props<T extends ObjetcIdValue> {
  items: T[];
  onOpen?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  alertOnDelete?: alertListItemButton;
  onStar?: (item: T) => void;
  onShare?: (item: T) => void;
  isStarred?: (item: T) => boolean;
  emptyMessage?: string;
  orderNumber?: boolean;
}

export function CustomListItem<T extends ObjetcIdValue>({
  items,
  onOpen,
  onEdit,
  onDelete,
  alertOnDelete,
  onStar,
  onShare,
  isStarred,
  emptyMessage = "No hay elementos registrados",
  orderNumber = false,
}: Props<T>) {
  const showAlert = useAlert();

  if (!items || items.length === 0) {
    return <Text style={textStyles.textPrimaryL}>{emptyMessage}</Text>;
  }

  const [star,setStar] = useState<boolean>(false);

  const handleOnDelete = async (item: T) => {
    if (onDelete == null) return;
    if (alertOnDelete == null) return;
    const confirm = await showAlert(alertOnDelete.title, alertOnDelete.text);
    if (confirm) onDelete(item);
  };

  const handleOnStar = (item:T) =>{
    if(onStar){
      onStar(item);
    }
    
  }

  return (
    <View>
      {items.map((item, index) => {
        const starred = isStarred ? isStarred(item) : false;
        const displayValue = orderNumber
          ? `${index + 1} - ${item.value}`
          : item.value;

        return (
          <View key={item.id} style={styles.row}>
            {onOpen ? (
              <View style={styles.labelContainer}>
              <CustomButtonText 
                onPress={() => onOpen(item)}
                text={displayValue}
              />
              </View>
            ) : (
              <View style={styles.labelContainer}>
                <Text style={textStyles.textPrimaryM}>{displayValue}</Text>
              </View>
            )}

            <View style={styles.actions}>
              {onStar && (
                <CustomButtonIcon
                    name={starred ? "star" : "star-outline"}
                    size={theme.spacing.l}
                    color={theme.colors.accent}
                    onPress={() => handleOnStar(item)}
                        />
              )}

              {onShare && (
                <CustomButtonIcon
                    name="share-social-outline"
                    size={theme.spacing.l}
                    color={theme.colors.primary}
                    onPress={() => onShare(item)}
                        />
              )}

              {onEdit && (
                 <CustomButtonIcon
                    name="pencil-outline"
                    size={theme.spacing.l}
                    color={theme.colors.tertiary}
                    onPress={() => onEdit(item)}
                        />
              )}

              {onDelete && (
                <CustomButtonIcon
                    name="trash-outline"
                    size={20}
                    color={theme.colors.error}
                    onPress={() => handleOnDelete(item)}
                        />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },
  labelContainer: {
    maxWidth: "60%",
    flexShrink: 1,
    paddingRight: theme.spacing.xs,
  },
  actions: {
    maxWidth: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing.s,
  },
  iconButton: {
    padding: theme.spacing.xs,
    borderRadius: 8,
  },
});
