import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ObjetcIdValue } from "@/components/Clases";

import {
  Card,
  crearCard,
  Deck,
  editarCard,
  eliminarCard,
  obtenerCardsPorDeck,
  obtenerDeckPorId,
} from "@/components/db/cardsDB";
import CustomButtom from "@/components/shared/utils/CustomButtom";
import { CustomListItem } from "@/components/shared/utils/CustomListItem";
import QuickForm from "@/components/shared/utils/QuickForm";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { useTranslation } from "react-i18next";

interface CardListItem extends ObjetcIdValue {
  frente: string;
  reverso: string;
  deck_id: number;
}

export default function EditDeckScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deckName } = useLocalSearchParams<{ deckName: string }>();

  const router = useRouter();
  const deckId = Number(id);

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardListItem[]>([]);
  const [quickFormEdit, setquickFormEdit] = useState<number | null>();
  const [quickFormNew, setquickFormNew] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<string[]>();

  const loadData = useCallback(() => {
    console.log("Deck ID recibido:", deckId);
    if (!deckId) return;

    // 1. Retrieve deck details
    const currentDeck = obtenerDeckPorId(deckId);
    setDeck(currentDeck);

    // 2. Fetch and format cards for CustomListItem
    const cardsDB: Card[] = obtenerCardsPorDeck(deckId);
    const formattedCards: CardListItem[] = cardsDB.map((card) => ({
      id: card.id,
      value: card.frente,
      frente: card.frente,
      reverso: card.reverso,
      deck_id: card.deck_id,
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
    eliminarCard(Number(item.id));
    loadData();
  };

  const handleEditCard = (item: CardListItem) => {
    setquickFormEdit(Number(item.id));
    setInitialValues([item.frente, item.reverso]);
  };

  const handleNewCard = (fields: string[]) => {
    crearCard(deckId, fields[0], fields[1]);
    setquickFormNew(false);
    loadData();
  };

  const editCard = (fields: string[]) => {
    if (quickFormEdit != null) editarCard(quickFormEdit, fields[0], fields[1]);
    setquickFormEdit(null);
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
      <Stack.Screen
        options={{
          title: t("deck.edit.title"),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background, // Color de fondo de la barra superior
          },
          headerTintColor: theme.colors.textSecondary,
        }}
      />
      <Text style={textStyles.textPrimaryL}>{deck.nombre}</Text>
      <ScrollView style={globalStyles.container}>
        <CustomListItem
          items={cards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
          alertOnDelete={{
            title: "Delete Card",
            text: "Are you sure you want to delete this card?",
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
          onSubmit={editCard}
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
    </View>
  );
}
