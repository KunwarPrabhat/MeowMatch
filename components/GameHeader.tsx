import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface GameHeaderProps {
  level: number;
  timeElapsed: number;
  onRestart: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ level, timeElapsed, onRestart }) => {
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.statsContainer}>
        <Text style={styles.levelText}>Level {level + 1}</Text>
        <Text style={styles.timeText}>{formatTime(timeElapsed)}</Text>
      </View>
      
      <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
        <FontAwesome5 name="redo" size={16} color="#fff" />
        <Text style={styles.restartText}>Restart</Text>
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
  },
  statsContainer: {
    flexDirection: 'column',
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate-50
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#94A3B8', // Slate-400
    fontVariant: ['tabular-nums'],
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6', // Blue-500
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  restartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
