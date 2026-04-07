import { useState, useEffect, useCallback } from 'react';

export type CardData = {
  id: string;
  imageSource: any;
  isFlipped: boolean;
  isMatched: boolean;
};

export type LevelParams = {
  rows: number;
  cols: number;
  numPairs: number;
};

const LEVELS: LevelParams[] = [
  { cols: 2, rows: 2, numPairs: 2 },
  { cols: 3, rows: 2, numPairs: 3 },
  { cols: 3, rows: 4, numPairs: 6 },
];

const CAT_IMAGES = [
  require('../assets/MemeCat/bananacat.jpg'),
  require('../assets/MemeCat/beluga.jpg'),
  require('../assets/MemeCat/crying.jpeg'),
  require('../assets/MemeCat/maxwellcat.jpeg'),
  require('../assets/MemeCat/popcat.jpg'),
  require('../assets/MemeCat/smudgecat.jpg'),
];

export const useGameLogic = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const levelParams = LEVELS[currentLevelIndex];

  // Shuffles an array in place
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeLevel = useCallback((levelIdx: number) => {
    const level = LEVELS[levelIdx];
    
    // Select required number of pairs from the images
    const selectedImages = CAT_IMAGES.slice(0, level.numPairs);
    
    // Create pair of cards for each selected image
    let newCards: CardData[] = [];
    selectedImages.forEach((img, index) => {
      newCards.push({
        id: `card_${index}_A`,
        imageSource: img,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: `card_${index}_B`,
        imageSource: img,
        isFlipped: false,
        isMatched: false,
      });
    });

    newCards = shuffleArray(newCards);

    setCards(newCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setIsLocked(false);
    setTimeElapsed(0);
    setTimerActive(true);
    setGameWon(false);
  }, []);

  // Initialize the first level on mount
  useEffect(() => {
    initializeLevel(currentLevelIndex);
  }, [currentLevelIndex, initializeLevel]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameWon]);

  const handleCardPress = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    // Flip the selected card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // If two cards are flipped, check for match
    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].imageSource === cards[secondIndex].imageSource) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs((prev) => prev + 1);
          setIsLocked(false);
        }, 500); // Small delay to let user see the match
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  // Check for level completion
  useEffect(() => {
    if (cards.length > 0 && matchedPairs === levelParams.numPairs) {
      setTimerActive(false);
      if (currentLevelIndex < LEVELS.length - 1) {
        // Automatically progress to next level after a delay
        setTimeout(() => {
          setCurrentLevelIndex((prev) => prev + 1);
        }, 1500);
      } else {
        setGameWon(true);
      }
    }
  }, [matchedPairs, cards.length, levelParams.numPairs, currentLevelIndex]);

  const restartGame = () => {
    setCurrentLevelIndex(0);
    initializeLevel(0);
  };

  return {
    cards,
    handleCardPress,
    levelParams,
    currentLevelIndex,
    timeElapsed,
    gameWon,
    restartGame,
  };
};
