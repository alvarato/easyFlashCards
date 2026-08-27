import Card from "@/components/Card";
import Carrusel from "@/components/Carrucel";
import {
  Card as CardData,
  obtenerCardsPorDeck,
  obtenerDeckPorId,
} from "@/components/db/cardsDB";
import { obtenerConfigs, Settings } from "@/components/db/settingsDB";
import GuessableWord from "@/components/guesseableWord/GuessableWord";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { theme } from "@/styles/Theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function DeckGameScreen() {
  const [settings, setSettings] = useState<Settings>();

  const { t } = useTranslation();

  const loadSettings = useCallback(() => {
    const settings = obtenerConfigs();
    setSettings(obtenerConfigs());
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();
  const deckId = Number(id);

  const [nombreDeck, setNombreDeck] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    const deck = obtenerDeckPorId(deckId);
    setNombreDeck(deck?.nombre ?? "Deck");
    setCards(obtenerCardsPorDeck(deckId));
    loadSettings();
  }, [deckId]);

  const getBackCard = (reverso: string): string | React.ReactNode => {
    if (settings?.read) return reverso.replace(/[()]/g, "");
    return (
      <GuessableWord
        word={reverso}
        onComplete={() => console.log("¡Correcto!")}
        textCheck={t("deck.button.check")}
        textShowAnswer={t("deck.button.showAnswer")}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{
          title: nombreDeck,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background, // Color de fondo de la barra superior
          },
          headerTintColor: theme.colors.textSecondary,
        }}
      />

      {cards.length === 0 ? (
        <Text style={textStyles.textPrimaryL}>
          Este deck todavía no tiene tarjetas.
        </Text>
      ) : (
        <Carrusel
          random={settings?.random}
          items={cards.map((card) => (
            <Card
              key={card.id}
              front={card.frente}
              back={getBackCard(card.reverso)}
            />
          ))}
        />
      )}
    </View>
  );
}
