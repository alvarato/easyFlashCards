import Card from "@/components/Card";
import Carrusel, { CarruselHandle } from "@/components/Carrucel";
import { CommonStackScreen } from "@/components/CommonStackScreen";
import {
  Card as CardData,
  getCardsByDeck,
  getDeckById,
  rateCardSimple
} from "@/components/db/cardsDB";
import { getSettings, Settings } from "@/components/db/settingsDB";
import GuessableWord from "@/components/guesseableWord/GuessableWord";
import CustomButton from "@/components/shared/utils/CustomButton";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function DeckGameScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deckId = Number(id);

  const [nombreDeck, setNombreDeck] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [settings, setSettings] = useState<Settings>();
  const [canAdvance, setCanAdvance] = useState(false);

  const carruselRef = useRef<CarruselHandle>(null);

  const handleFeedback = (result: boolean) => {
    setCanAdvance(true);
    const index = carruselRef.current?.getIndex();
    const card:CardData = cards[Number(index)];
    if (card != null){
      rateCardSimple(card.id, result);
    }
  };

  const handleNextCard = () => {
    carruselRef.current?.goNext();
    setCanAdvance(false);
  };

  useEffect(() => {
    const setting = getSettings();
    setSettings(setting);

    const deck = getDeckById(deckId);
    setNombreDeck(deck?.name ?? "Deck");
    const CardsDB = getCardsByDeck(deckId);

    if (setting.random) setCards(shuffleArray(CardsDB));
    else setCards(CardsDB);
  }, [deckId]);

  const getBackCard = (reverso: string): string | React.ReactNode => {
    if (settings?.read) return reverso.replace(/[()]/g, "");
    return (
      <GuessableWord
        word={reverso}
        onComplete={() => console.log("¡Correcto!")}
        textCheck={t("deck.button.check")}
        textShowAnswer={t("deck.button.showAnswer")}
        handleFeedback={handleFeedback}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      <CommonStackScreen title={nombreDeck} />

      {cards.length === 0 ? (
        <Text style={textStyles.textPrimaryL}>
          Este deck todavía no tiene tarjetas.
        </Text>
      ) : (
        <Carrusel
          ref={carruselRef}
          onlyRead={settings?.read}
          items={cards.map((card) => (
            <Card
              key={card.id}
              front={card.front}
              back={getBackCard(card.back)}
            />
          ))}
        />
      )}
      {canAdvance && (
        <CustomButton text={t("general.next")} onPress={handleNextCard} />
      )}
    </View>
  );
}
