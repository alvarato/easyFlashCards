import { alertListItemButton } from "@/components/Clases";
import {
  Deck,
  deleteDeck,
  getDecks,
} from "@/components/db/cardsDB";
import { CustomListItem } from "@/components/shared/utils/CustomListItem";
import CustomSearchBar from "@/components/shared/utils/CustomSearchBar";
import { globalStyles } from "@/styles/Styles";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

// CustomListItem espera objetos con { id, value } (ObjetcIdValue).
// Deck trae { id, nombre, creado_en }, asi que lo adaptamos.
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
  const [decks, setDecks] = useState<DeckItem[]>([]); // lista original completa, ya mapeada
  const [filteredDecks, setFilteredDecks] = useState<DeckItem[]>([]);
  const router = useRouter();

  const loadDecks = useCallback(() => {
    const todos = getDecks().map(toDeckItem);
    setDecks(todos);
    setFilteredDecks(todos);
  }, []);

  const onDeleteAlet: alertListItemButton = {
    title: t("home.askDeleteDeck"),
  };

  // Recarga la lista cada vez que se vuelve a esta pantalla
  // (por ejemplo, al volver de crear un deck nuevo)
  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [loadDecks]),
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

  return (
    <View style={globalStyles.container}>
      <CustomSearchBar
        items={decks}
        searchKeys={["value"]}
        onResults={setFilteredDecks}
        placeholder={t("home.searchPlaceholder")}
      />
      <ScrollView>
        <CustomListItem
          items={filteredDecks}
          onOpen={handleOpen}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
          alertOnDelete={onDeleteAlet}
          emptyMessage={t("home.emptyDeck")}
        />
      </ScrollView>
    </View>
  );
}