import { alertListItemButton } from "@/components/Clases";
import { Deck, deleteDeck, getDecks } from "@/components/db/cardsDB";
import { getSettings, Settings } from "@/components/db/settingsDB";
import CustomButton from "@/components/shared/utils/CustomButton";
import { CustomListItem } from "@/components/shared/utils/CustomListItem";
import CustomSearchBar from "@/components/shared/utils/CustomSearchBar";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

export type DeckItem = {
  id: number;
  value: string;
  deck: Deck;
};

function toDeckItem(deck: Deck): DeckItem {
  return {
    id: deck.id,
    value: deck.name,
    deck,
  };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<DeckItem[]>([]);
  const [settings, setSettings] = useState<Settings>();
  const [advanceStudy, setAdvanceStudy] = useState<number[]>([]);
  const router = useRouter();

  const loadDecks = useCallback(() => {
    const allDecks = getDecks().map(toDeckItem);
    setDecks(allDecks);
    setFilteredDecks(allDecks);
  }, []);

  const loadSettings = useCallback(() => {
    const setting = getSettings();
    setSettings(setting);
  }, []);

  const onDeleteAlet: alertListItemButton = {
    title: t("home.askDeleteDeck"),
  };

  useFocusEffect(
    useCallback(() => {
      loadDecks();
      loadSettings();
    }, [loadDecks, loadSettings]),
  );

  const handleOpen = (item: DeckItem) => {
    router.push(`/deck/${item.id}`);
  };

  const handleEdit = (item: DeckItem) => {
    router.push({
      pathname: "/deck/edit",
      params: { id: item.id, deckName: item.value },
    });
  };

  const handleDelete = (item: DeckItem) => {
    deleteDeck(item.id);
    loadDecks();
  };

  const handleShare = (item: DeckItem) => {
    router.push({
      pathname: "/deck/share",
      params: { id: item.id, deckName: item.value },
    });
  };

  const handleStar = (item: DeckItem) => {
    setAdvanceStudy((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id],
    );
  };

  const checkIfStarred = (item: DeckItem): boolean => {
    return advanceStudy.includes(item.id);
  };

  const startAdvanceStudy = () => {
    router.push(`/deck/${advanceStudy.join(",")}?advance=true`);
  };

  return (
    <View style={globalStyles.container}>
      <CustomSearchBar
        items={decks}
        searchKeys={["value"]}
        onResults={setFilteredDecks}
        placeholder={t("home.searchPlaceholder")}
      />
      <ScrollView>
        {!settings?.advance ? (
          // Modo Normal: Permite abrir, editar, borrar y compartir
          <CustomListItem
            items={filteredDecks}
            onOpen={handleOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
            alertOnDelete={onDeleteAlet}
            emptyMessage={t("home.emptyDeck")}
          />
        ) : (
          <View>
          <Text style={textStyles.textPrimaryL}>{t("home.selectDeck")}</Text>
          <CustomListItem
            items={filteredDecks}
            onOpen={handleStar}
            onStar={handleStar}
            isStarred={checkIfStarred}
            emptyMessage={t("home.emptyDeck")}
          />
          </View>
        )}
        
      </ScrollView>
      {advanceStudy.length > 0 && 
      <CustomButton text={t("general.start")} onPress={startAdvanceStudy} />}
    </View>
  );
}
