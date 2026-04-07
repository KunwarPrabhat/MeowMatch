import React, { useEffect, memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { playSound } from '../utils/audio';
import { useSettings } from '../contexts/SettingsContext';
import * as Haptics from 'expo-haptics';

// --- FIX: Extract each particle into its own component ---
// Calling hooks (useSharedValue, useEffect) inside .map() violates
// the Rules of Hooks and causes the 'Cannot set property of undefined' crash.
const Particle = memo(({ size, left, duration }: { size: number; left: number; duration: number }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-600, { duration, easing: Easing.linear }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: duration / 2 }),
        withTiming(0, { duration: duration / 2 })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#38bdf8',
          left: `${left}%`,
          bottom: -size,
        },
        style,
      ]}
    />
  );
});

// Pre-generate stable particle configs so they don't re-randomize on every render
const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  size: Math.random() * 20 + 10,
  left: Math.random() * 95,
  duration: Math.random() * 4000 + 3000,
}));

const FloatingParticles = () => (
  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
    {PARTICLES.map((p) => (
      <Particle key={p.id} size={p.size} left={p.left} duration={p.duration} />
    ))}
  </View>
);

// --- Bouncing Button Component ---
const BouncingButton = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => {
  const scale = useSharedValue(1);
  const { soundEnabled, vibrationEnabled } = useSettings();

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const handlePress = () => {
    playSound('click', soundEnabled);
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <FontAwesome5 name={icon} size={20} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

// --- Home Screen ---
export default function HomeScreen() {
  const router = useRouter();
  const titleScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { lowPerformanceMode } = useSettings();

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    titleOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!lowPerformanceMode && <FloatingParticles />}

      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.titleText}>Meowmory</Text>
        <Text style={styles.subtitleText}>The Purrfect Match Game</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <BouncingButton title="Play Now" icon="play" onPress={() => router.push('/game')} />
        <View style={{ height: 16 }} />
        <BouncingButton title="Settings" icon="cog" onPress={() => router.push('/settings')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
    zIndex: 10,
  },
  titleText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#F8FAFC',
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitleText: {
    fontSize: 18,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    maxWidth: 400,
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#60A5FA',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
