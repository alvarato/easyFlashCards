import { alertListItemButton, ObjetcIdValue } from "@/components/Clases";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAlert } from "../alerts/AlertProvider";

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

  const handleOnDelete = async (item: T) => {
    if (onDelete == null) return;
    if (alertOnDelete == null) return;
    const confirm = await showAlert(alertOnDelete.title, alertOnDelete.text);
    if (confirm) onDelete(item);
  };

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
              <Pressable
                onPress={() => onOpen(item)}
                style={({ pressed }) => [
                  styles.labelContainer,
                  pressed && styles.iconButtonPressed,
                ]}
                hitSlop={8}
              >
                <Text style={textStyles.textPrimaryM}>{displayValue}</Text>
              </Pressable>
            ) : (
              <View style={styles.labelContainer}>
                <Text style={textStyles.textPrimaryM}>{displayValue}</Text>
              </View>
            )}

            <View style={styles.actions}>
              {onStar && (
                <Pressable
                  onPress={() => onStar(item)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name={starred ? "star" : "star-outline"}
                    size={20}
                    color={theme.colors.accent}
                  />
                </Pressable>
              )}

              {onShare && (
                <Pressable
                  onPress={() => onShare(item)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                </Pressable>
              )}

              {onEdit && (
                <Pressable
                  onPress={() => onEdit(item)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={theme.colors.tertiary}
                  />
                </Pressable>
              )}

              {onDelete && (
                <Pressable
                  onPress={() => handleOnDelete(item)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.colors.error}
                  />
                </Pressable>
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
  iconButtonPressed: {
    backgroundColor: theme.colors.background,
  },
});
