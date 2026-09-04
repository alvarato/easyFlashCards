import {
  useFocusEffect,
  useLocalSearchParams
} from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ObjetcIdValue } from "@/components/Clases";

import { CommonStackScreen } from "@/components/CommonStackScreen";
import {
  Card,
  createCard,
  Deck,
  deleteCard,
  editCard,
  getCardsByDeck,
  getDeckById,
  renameDeck,
  swapDeckSides,
} from "@/components/db/cardsDB";
import CustomButtom from "@/components/shared/utils/CustomButton";
import CustomButtonIcon from "@/components/shared/utils/CustomButtonIcon";
import { CustomListItem } from "@/components/shared/utils/CustomListItem";
import QuickForm from "@/components/shared/utils/QuickForm";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { useTranslation } from "react-i18next";

interface CardListItem extends ObjetcIdValue {
  front: string;
  back: string;
  deck_id: number;
}

export default function EditDeckScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deckId = Number(id);

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardListItem[]>([]);
  const [quickFormEdit, setquickFormEdit] = useState<number | null>();
  const [quickFormNew, setquickFormNew] = useState<boolean>(false);
  const [quickFormEditName, setQuickFormEditName] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<string[]>();

  const loadData = useCallback(() => {
    console.log("Deck ID recibido:", deckId);
    if (!deckId) return;

    // 1. Retrieve deck details
    const currentDeck = getDeckById(deckId);
    setDeck(currentDeck);

    // 2. Fetch and format cards for CustomListItem
    const cardsDB: Card[] = getCardsByDeck(deckId);
    const formattedCards: CardListItem[] = cardsDB.map((card) => ({
      id: card.id,
      value: card.front,
      front: card.front,
      back: card.back,
      deck_id: card.id,
    }));

    setCards(formattedCards);
  }, [deckId]);

  // Se ejecuta cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDeleteCard = (item: CardListItem) => {
    deleteCard(Number(item.id));
    loadData();
  };

  const handleEditCard = (item: CardListItem) => {
    setquickFormEdit(Number(item.id));
    setInitialValues([item.front, item.back]);
  };

  const handleNewCard = (fields: string[]) => {
    createCard(deckId, fields[0], fields[1]);
    setquickFormNew(false);
    loadData();
  };

  const sendEditCard = (fields: string[]) => {
    if (quickFormEdit != null) editCard(quickFormEdit, fields[0], fields[1]);
    setquickFormEdit(null);
    loadData();
  };

  const handleNameEdit = () => {
    setQuickFormEditName(true);
    loadData();
  };

  const handleSwapSides = () => {
    swapDeckSides(deckId);
    loadData();
  };

  const editName = (fields: string[]) => {
    renameDeck(deckId, fields[0]);
    setQuickFormEditName(false);
    loadData();
  };

  if (!deck) {
    return (
      <View style={globalStyles.container}>
        <Text style={textStyles.textPrimaryM}>Deck not found</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <CommonStackScreen title={t("deck.edit.title")}/>
      
      <View style={{ flexDirection: "row", justifyContent: "space-around", gap: 8 }}>
        <Text style={[textStyles.textPrimaryL,{maxWidth:"70%"}]}>{deck.name}</Text>
        <CustomButtonIcon
          name="pencil-outline"
          size={theme.spacing.xl}
          color={theme.colors.tertiary}
          onPress={handleNameEdit} 
        />
        <CustomButtonIcon
          name="swap-horizontal"
          size={theme.spacing.xl}
          color={theme.colors.accent}
          onPress={handleSwapSides} 
        />
      </View>
      <ScrollView style={globalStyles.container}>
        <CustomListItem
          items={cards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
          alertOnDelete={{
            title: t("deck.edit.delete"),
            text: t("deck.edit.askDeleteDeck"),
          }}
          orderNumber={true}
          emptyMessage={t("deck.edit.noCards")}
        />
        <View style={{ marginTop: 40 }}></View>
      </ScrollView>
      <CustomButtom
        text={t("deck.newCard")}
        onPress={() => setquickFormNew(true)}
      />
      {quickFormEdit && (
        <QuickForm
          fields={["front", "back"]}
          initialValues={initialValues}
          title={t("deck.edit.form")}
          onSubmit={sendEditCard}
          onCancel={() => setquickFormEdit(null)}
          t={t}
        />
      )}
      {quickFormNew && (
        <QuickForm
          fields={["front", "back"]}
          initialValues={initialValues}
          title={t("deck.edit.newCard")}
          onSubmit={handleNewCard}
          onCancel={() => setquickFormNew(false)}
          t={t}
        />
      )}
      {quickFormEditName && (
        <QuickForm
          fields={["title"]}
          initialValues={[deck.name]}
          title={t("deck.edit.nameForm")}
          onSubmit={editName}
          onCancel={() => setQuickFormEditName(false)}
          t={t}
        />
      )}
    </View>
  );
}