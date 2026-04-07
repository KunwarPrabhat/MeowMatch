import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playSound } from '../utils/audio';
import * as Haptics from 'expo-haptics';

export type CardData = {
  id: string;
  imageSource: any;
  isFlipped: boolean;
  isMatched: boolean;
  isError: boolean;
};

export type LevelParams = {
  rows: number;
  cols: number;
  numPairs: number;
};

const LEVELS: LevelParams[] = [
  { cols: 2, rows: 2, numPairs: 2 },
  { cols: 3, rows: 2, numPairs: 3 },
  { cols: 4, rows: 3, numPairs: 6 }, // 3x4 grid gives 12 cards
];

const CAT_IMAGES = [
  require('../assets/MemeCat/bananacat.jpg'),
  require('../assets/MemeCat/beluga.jpg'),
  require('../assets/MemeCat/crying.jpeg'),
  require('../assets/MemeCat/maxwellcat.jpeg'),
  require('../assets/MemeCat/popcat.jpg'),
  require('../assets/MemeCat/smudgecat.jpg'),
];

export type GameState = 'preview' | 'playing' | 'finished';

export const useGameLogic = () => {
  const { soundEnabled, vibrationEnabled } = useSettings();
  
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<GameState>('preview');

  const levelParams = LEVELS[currentLevelIndex];

  // Shuffles an array in place
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const triggerHaptic = (type: 'light' | 'success' | 'error') => {
    if (!vibrationEnabled) return;
    switch(type) {
      case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
      case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
      case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
    }
  };

  const initializeLevel = useCallback((levelIdx: number) => {
    const level = LEVELS[levelIdx];
    const selectedImages = CAT_IMAGES.slice(0, level.numPairs);
    
    let newCards: CardData[] = [];
    selectedImages.forEach((img, index) => {
      newCards.push({ id: `card_${index}_A`, imageSource: img, isFlipped: true, isMatched: false, isError: false });
      newCards.push({ id: `card_${index}_B`, imageSource: img, isFlipped: true, isMatched: false, isError: false });
    });

    newCards = shuffleArray(newCards);

    setCards(newCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsLocked(true); // Locked during preview
    setTimeElapsed(0);
    setGameState('preview');

    // 2 Second Preview Phase
    setTimeout(() => {
      setCards(prevCards => prevCards.map(c => ({ ...c, isFlipped: false })));
      setIsLocked(false);
      setGameState('playing');
    }, 2000);
  }, []);

  // Initialize the first level on mount
  useEffect(() => {
    initializeLevel(currentLevelIndex);
  }, [currentLevelIndex, initializeLevel]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleCardPress = (index: number) => {
    if (isLocked || gameState !== 'playing' || cards[index].isFlipped || cards[index].isMatched) return;

    playSound('flip', soundEnabled);
    triggerHaptic('light');

    // Flip card immediately
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // Two cards flipped evaluation
    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].imageSource === cards[secondIndex].imageSource) {
        // MATCH SUCCESS
        playSound('success', soundEnabled);
        triggerHaptic('success');
        
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs((prev) => prev + 1);
          setIsLocked(false);
        }, 300); 

      } else {
        // MATCH FAILED
        playSound('error', soundEnabled);
        triggerHaptic('error');
        
        // Trigger error shake state
        const errorCards = [...cards];
        errorCards[firstIndex].isError = true;
        errorCards[secondIndex].isError = true;
        setCards(errorCards);

        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[firstIndex].isError = false;
          resetCards[secondIndex].isFlipped = false;
          resetCards[secondIndex].isError = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  // Check level completion
  useEffect(() => {
    if (cards.length > 0 && matchedPairs === levelParams.numPairs) {
      if (currentLevelIndex < LEVELS.length - 1) {
        // Auto progress to next level
        setTimeout(() => {
          setCurrentLevelIndex((prev) => prev + 1);
        }, 1500);
      } else {
        setGameState('finished');
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
    moves,
    gameState,
    restartGame,
  };
};
