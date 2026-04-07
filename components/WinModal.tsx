import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSettings } from '../contexts/SettingsContext';

interface WinModalProps {
  timeElapsed: number;
  moves: number;
  onReplay: () => void;
}

const { width, height } = Dimensions.get('window');

export const WinModal: React.FC<WinModalProps> = ({ timeElapsed, moves, onReplay }) => {
  const router = useRouter();
  const scaleAnim = useSharedValue(0.5);
  const opacityAnim = useSharedValue(0);
  const { lowPerformanceMode } = useSettings();

  useEffect(() => {
    scaleAnim.value = withSpring(1, { damping: 14, stiffness: 150 });
    opacityAnim.value = withTiming(1, { duration: 400 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: opacityAnim.value,
  }));

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.overlay}>
      {!lowPerformanceMode && (
        <ConfettiCannon 
          count={200} 
          origin={{ x: width / 2, y: -20 }} 
          fallSpeed={3000}
          explosionSpeed={500}
          fadeOut={true}
        />
      )}
      
      <Animated.View style={[styles.modalBox, animatedStyle]}>
        <Text style={styles.title}>You Win! 🎉</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Moves</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => router.replace('/')}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.replayButton]} onPress={onReplay}>
            <Text style={styles.replayButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Dark blur effect simulation
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 24,
    textShadowColor: 'rgba(56, 189, 248, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    backgroundColor: '#334155',
  },
  homeButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  replayButton: {
    backgroundColor: '#3B82F6',
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  replayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
