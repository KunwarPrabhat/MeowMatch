import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameLogic } from '../../hooks/useGameLogic';
import { GameHeader } from '../../components/GameHeader';
import { GameBoard } from '../../components/GameBoard';

export default function HomeScreen() {
  const {
    cards,
    handleCardPress,
    levelParams,
    currentLevelIndex,
    timeElapsed,
    gameWon,
    restartGame,
  } = useGameLogic();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GameHeader
        level={currentLevelIndex}
        timeElapsed={timeElapsed}
        onRestart={restartGame}
      />
      
      <View style={styles.boardContainer}>
        <GameBoard 
          cards={cards} 
          onCardPress={handleCardPress} 
          levelParams={levelParams} 
        />
      </View>

      {gameWon && (
        <View style={styles.winOverlay}>
          <Text style={styles.winTitle}>You Win 🎉</Text>
          <Text style={styles.winSubtitle}>You matched all the meme cats!</Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate-900 (Dark background requested)
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Semi-transparent Slate-900
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  winTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  winSubtitle: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 32,
  },
  playAgainButton: {
    backgroundColor: '#3B82F6', // Blue-500
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
