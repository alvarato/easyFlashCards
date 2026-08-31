import Card from "@/components/Card";
import Carrusel, { CarruselHandle } from "@/components/Carrucel";
import { CommonStackScreen } from "@/components/CommonStackScreen";
import {
  Card as CardData,
  obtenerCardsPorDeck,
  obtenerDeckPorId,
  rateCardSimple,
} from "@/components/db/cardsDB";
import { obtenerConfigs, Settings } from "@/components/db/settingsDB";
import GuessableWord from "@/components/guesseableWord/GuessableWord";
import CustomButton from "@/components/shared/utils/CustomButton";
import { globalStyles } from "@/styles/Styles";
import { textStyles } from "@/styles/Texts";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [settings, setSettings] = useState<Settings>();
  const carruselRef = useRef<CarruselHandle>(null);
  const [canAdvance, setCanAdvance] = useState(false);

  const handleFeedback = (result: boolean) => {
    // acá tu lógica: guardar resultado, actualizar repetición espaciada, etc.
    console.log(result); // true = bien, false = mal
    setCanAdvance(true); // habilita el botón "Siguiente"
    rateCardSimple(1,result)
  };
const handleNextCard = () => {
  carruselRef.current?.goNext();
  setCanAdvance(false);
};
  const { t } = useTranslation();

  const loadSettings = useCallback(() => {
    setSettings(obtenerConfigs());
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();
  const deckId = Number(id);

  const [nombreDeck, setNombreDeck] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    const deck = obtenerDeckPorId(deckId);
    setNombreDeck(deck?.nombre ?? "Deck");
    const CardsDB =(obtenerCardsPorDeck(deckId));
    if(settings?.random) setCards(shuffleArray(CardsDB));
    else setCards(CardsDB)
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
        handleFeedback={handleFeedback}
      />
    );
  };

  return (
    <View style={globalStyles.container}>

      <CommonStackScreen title={nombreDeck}/>

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
              front={card.frente}
              back={getBackCard(card.reverso)}
              
            />
          ))}
        />
      )}
      { canAdvance &&
        <CustomButton text={t("general.next")} onPress={handleNextCard}/>
      }
      
    </View>
  );
}
