import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { CardData } from '../hooks/useGameLogic';

interface CardProps {
  card: CardData;
  onPress: () => void;
  width: number;
  height: number;
}

export const Card: React.FC<CardProps> = ({ card, onPress, width, height }) => {
  const flipAnim = useSharedValue(card.isFlipped || card.isMatched ? 1 : 0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    // If the game logic dictates it's flipped or matched, ensure it's at 1. Otherwise back to 0.
    const targetValue = card.isFlipped || card.isMatched ? 1 : 0;
    if (flipAnim.value !== targetValue) {
      flipAnim.value = withTiming(targetValue, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [card.isFlipped, card.isMatched]);

  const handlePressIn = () => {
    if (!card.isFlipped && !card.isMatched) {
      scaleAnim.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      zIndex: flipAnim.value < 0.5 ? 2 : 1, // Fix for android backface visibility sometimes acting weird
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
          <FontAwesome5 name="question" size={Math.min(width, height) * 0.4} color="#CBD5E1" />
        </Animated.View>

        {/* Back of Card (Meme Cat) */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          {card.isMatched && <View style={styles.matchedOverlay} />}
          <Image source={card.imageSource} style={styles.image} resizeMode="cover" />
        </Animated.View>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 6,
    perspective: 1000, // Important for 3D effect on web
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,               // Android shadow
    shadowColor: '#000',        // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardFront: {
    backgroundColor: '#334155', // Slate-700
    borderWidth: 2,
    borderColor: '#475569',     // Slate-600
  },
  cardBack: {
    backgroundColor: '#1E293B', // Slate-800
    overflow: 'hidden', // to keep border radius on image
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 197, 94, 0.4)', // Green tint on match
    zIndex: 10,
  }
});
