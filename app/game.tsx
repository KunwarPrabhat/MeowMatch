import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { WinModal } from '../components/WinModal';
import { useSettings } from '../contexts/SettingsContext';

// Deep background gradient simulation using animated dark circles
const BackgroundGlows = () => {
  const glow1Opacity = useSharedValue(0.3);
  const glow2Opacity = useSharedValue(0.1);

  useEffect(() => {
    glow1Opacity.value = withRepeat(
      withSequence(withTiming(0.6, { duration: 4000 }), withTiming(0.3, { duration: 4000 })),
      -1, true
    );
    glow2Opacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 6000 }), withTiming(0.1, { duration: 6000 })),
      -1, true
    );
  }, []);

  const g1Style = useAnimatedStyle(() => ({ opacity: glow1Opacity.value }));
  const g2Style = useAnimatedStyle(() => ({ opacity: glow2Opacity.value }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Animated.View style={[styles.glowBall, { top: -100, left: -50, backgroundColor: '#38BDF8' }, g1Style]} />
      <Animated.View style={[styles.glowBall, { bottom: -150, right: -100, backgroundColor: '#818CF8' }, g2Style]} />
    </View>
  );
};

export default function GameScreen() {
  const {
    cards,
    handleCardPress,
    levelParams,
    currentLevelIndex,
    timeElapsed,
    moves,
    gameState,
    restartGame,
  } = useGameLogic();

  const insets = useSafeAreaInsets();
  const { lowPerformanceMode } = useSettings();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!lowPerformanceMode && <BackgroundGlows />}
      
      <GameHeader
        level={currentLevelIndex}
        timeElapsed={timeElapsed}
        moves={moves}
        onRestart={restartGame}
      />
      
      <View style={styles.boardContainer}>
        {gameState === 'preview' && (
          <Animated.Text style={styles.previewText}>
            Memorize!
          </Animated.Text>
        )}
        <GameBoard 
          cards={cards} 
          onCardPress={handleCardPress} 
          levelParams={levelParams} 
        />
      </View>

      {gameState === 'finished' && (
        <WinModal 
          timeElapsed={timeElapsed} 
          moves={moves} 
          onReplay={restartGame} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
  },
  glowBall: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.3,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    position: 'absolute',
    top: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    zIndex: 10,
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
});
