import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../contexts/SettingsContext';
import { playSound } from '../utils/audio';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    soundEnabled, setSoundEnabled,
    vibrationEnabled, setVibrationEnabled,
    lowPerformanceMode, setLowPerformanceMode
  } = useSettings();

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    playSound('click', soundEnabled);
    if (vibrationEnabled) {
      Haptics.selectionAsync();
    }
    setter(!currentValue);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => {
            playSound('click', soundEnabled);
            router.back();
          }} 
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={24} color="#F8FAFC" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Balancing spacer */}
      </View>

      <View style={styles.settingsList}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5 name="volume-up" size={20} color="#94A3B8" />
            <Text style={styles.settingText}>Sound Effects</Text>
          </View>
          <Switch
            trackColor={{ false: '#334155', true: '#3B82F6' }}
            thumbColor={'#fff'}
            onValueChange={() => handleToggle(setSoundEnabled, soundEnabled)}
            value={soundEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5 name="wave-square" size={20} color="#94A3B8" />
            <Text style={styles.settingText}>Haptic Vibration</Text>
          </View>
          <Switch
            trackColor={{ false: '#334155', true: '#3B82F6' }}
            thumbColor={'#fff'}
            onValueChange={() => handleToggle(setVibrationEnabled, vibrationEnabled)}
            value={vibrationEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5 name="battery-half" size={20} color="#94A3B8" />
            <Text style={styles.settingText}>Low Performance Mode</Text>
          </View>
          <Switch
            trackColor={{ false: '#334155', true: '#3B82F6' }}
            thumbColor={'#fff'}
            onValueChange={() => handleToggle(setLowPerformanceMode, lowPerformanceMode)}
            value={lowPerformanceMode}
          />
        </View>
        <Text style={styles.hintText}>
          Turn on Low Performance Mode if your device struggles with the floating particles or rich animations.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  settingsList: {
    padding: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontSize: 18,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  hintText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  }
});
