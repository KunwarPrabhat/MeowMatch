import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Card } from './Card';
import { CardData, LevelParams } from '../hooks/useGameLogic';

interface GameBoardProps {
  cards: CardData[];
  onCardPress: (index: number) => void;
  levelParams: LevelParams;
}

export const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardPress, levelParams }) => {
  const { width, height } = useWindowDimensions();

  // Calculate maximum available space for the board
  const BOARD_PADDING = 24; // Padding around the board
  const CARD_MARGIN = 12; // Total margin per card (6px * 2)
  const HEADER_HEIGHT = 100; // Account for the header and safe area

  // Constraint the max board to width 500 (especially for web)
  const maxBoardMaxWidth = Math.min(width, 500) - BOARD_PADDING * 2;
  const maxBoardMaxHeight = height - HEADER_HEIGHT - BOARD_PADDING * 2;

  // Determine card size
  // width needed = maxBoardMaxWidth / cols - margins
  // height needed = maxBoardMaxHeight / rows - margins
  
  const possibleCardWidth = (maxBoardMaxWidth / levelParams.cols) - CARD_MARGIN;
  const possibleCardHeight = (maxBoardMaxHeight / levelParams.rows) - CARD_MARGIN;

  // We want to keep cards somewhat squarish or vertical rectangles, not super stretched
  // We'll take the min of the possible dimensions to ensure everything fits on screen
  const cardSize = Math.min(possibleCardWidth, possibleCardHeight, 200);

  return (
    <View style={styles.boardWrapper}>
      <View style={[styles.gridContainer, { maxWidth: maxBoardMaxWidth }]}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onPress={() => onCardPress(index)}
            width={cardSize}
            height={cardSize} // Using square cards for meme images
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
