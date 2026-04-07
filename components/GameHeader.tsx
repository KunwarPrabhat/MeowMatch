import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface GameHeaderProps {
  level: number;
  timeElapsed: number;
  moves: number;
  onRestart: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ level, timeElapsed, moves, onRestart }) => {
  const router = useRouter();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/')}>
        <FontAwesome5 name="arrow-left" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <Text style={styles.levelText}>Level {level + 1}</Text>
        <View style={styles.subStats}>
          <Text style={styles.timeText}>{formatTime(timeElapsed)}</Text>
          <View style={styles.divider} />
          <Text style={styles.movesText}>{moves} Moves</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.iconButton} onPress={onRestart}>
        <FontAwesome5 name="redo" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  iconButton: {
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
  movesText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
});
