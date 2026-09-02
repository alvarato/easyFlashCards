import Card from "@/components/Card";
import Carrusel, { CarruselHandle } from "@/components/Carrucel";
import { CommonStackScreen } from "@/components/CommonStackScreen";
import {
  Card as CardData,
  getCardsByDeck,
  getDeckById,
  rateCardSimple,
} from "@/components/db/cardsDB";
import { getSettings, Settings } from "@/components/db/settingsDB";
import GuessableWord from "@/components/guesseableWord/GuessableWord";
import { useAlert } from "@/components/shared/alerts/AlertProvider";
import CustomButton from "@/components/shared/utils/CustomButton";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { router, useLocalSearchParams } from "expo-router";
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
  const showAlert = useAlert();

  const [nombreDeck, setNombreDeck] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [settings, setSettings] = useState<Settings>();
  const [canAdvance, setCanAdvance] = useState(false);
  const carruselRef = useRef<CarruselHandle>(null);
  const [correctCount, setCorrectCount] = useState<number[]>([0, 0]);

  const sumCorrectCount = (flag: boolean) => {
    setCorrectCount((prev) => {
      const updated = [...prev];
      if (flag) {
        updated[0] += 1;
      } else {
        updated[1] += 1;
      }
      return updated;
    });
  };

  const handleFeedback = (result: boolean) => {
    sumCorrectCount(result);
    setCanAdvance(true);

    const index = carruselRef.current?.getIndex();
    const card: CardData = cards[Number(index)];
    if (card != null) {
      rateCardSimple(card.id, result);
    }
  };

  const handleNextCard = () => {
    carruselRef.current?.goNext();
    setCanAdvance(false);
  };

  const handleFinish = async () => {
    const title = t("general.total") +" " +correctCount[0]+"/"+cards.length;
    const confirm = await showAlert(title, "", false);
    if (confirm) router.back();
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
        <View style={{height:"80%"}}>
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
        </View>
      )}
      {canAdvance && !(correctCount[0] + correctCount[1] >= cards.length) && (
        <CustomButton text={t("general.next")} onPress={handleNextCard} />
      )}
      {correctCount[0] + correctCount[1] >= cards.length &&
        canAdvance &&
        !settings?.read && (
          <CustomButton text={t("general.finish")} onPress={handleFinish} />
        )}
      <View style={globalStyles.paddingBottom20}></View>
    </View>
  );
}
