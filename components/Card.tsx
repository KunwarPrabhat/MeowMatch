import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { CardData } from '../hooks/useGameLogic';
import { useSettings } from '../contexts/SettingsContext';

interface CardProps {
  card: CardData;
  onPress: () => void;
  width: number;
  height: number;
}

export const Card: React.FC<CardProps> = ({ card, onPress, width, height }) => {
  const flipAnim = useSharedValue(card.isFlipped || card.isMatched ? 1 : 0);
  const scaleAnim = useSharedValue(1);
  const shakeAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  const { lowPerformanceMode } = useSettings();

  // Flip & Match logic
  useEffect(() => {
    const targetValue = card.isFlipped || card.isMatched ? 1 : 0;
    if (flipAnim.value !== targetValue) {
      flipAnim.value = withSpring(targetValue, {
        stiffness: 150,
        damping: 15,
        mass: 0.8,
      });
    }

    if (card.isMatched && !lowPerformanceMode) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1, // infinite loop
        true
      );
    } else {
      pulseAnim.value = 1; // reset if not matched or low performance
    }
  }, [card.isFlipped, card.isMatched]);

  // Error (Shake) logic
  useEffect(() => {
    if (card.isError && !lowPerformanceMode) {
      shakeAnim.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [card.isError]);

  const handlePressIn = () => {
    if (!card.isFlipped && !card.isMatched) {
      scaleAnim.value = withSpring(1.05, { stiffness: 400 }); // "Juice" scale up slightly before press
    }
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, { stiffness: 400 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleAnim.value * pulseAnim.value },
        { translateX: shakeAnim.value }
      ],
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      zIndex: flipAnim.value < 0.5 ? 2 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      zIndex: flipAnim.value < 0.5 ? 1 : 2,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.cardContainer, { width, height }, animatedContainerStyle]}>
        
        {/* Front of Card (Question mark) */}
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <FontAwesome5 name="question" size={Math.min(width, height) * 0.4} color="#60A5FA" />
        </Animated.View>

        {/* Back of Card (Meme Cat) */}
        <Animated.View style={[
          styles.card, 
          styles.cardBack, 
          backAnimatedStyle,
          card.isMatched ? styles.matchedCard : null,
          card.isError ? styles.errorCard : null
        ]}>
          {card.isMatched && <View style={styles.matchedOverlay} />}
          {card.isError && <View style={styles.errorOverlay} />}
          <Image source={card.imageSource} style={styles.image} resizeMode="cover" />
        </Animated.View>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 8,
    perspective: 1200, // Important for 3D effect on web
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,               
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  cardFront: {
    backgroundColor: '#1E293B', // Darker slate
    borderWidth: 2,
    borderColor: '#3B82F6',     // Neon blue highlight
  },
  cardBack: {
    backgroundColor: '#0F172A',
    overflow: 'hidden', 
    borderWidth: 2,
    borderColor: 'transparent',
  },
  matchedCard: {
    borderColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  errorCard: {
    borderColor: '#EF4444',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 197, 94, 0.3)', // Green tint
    zIndex: 10,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(239, 68, 68, 0.3)', // Red tint
    zIndex: 10,
  }
});
