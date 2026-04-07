import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { SettingsProvider } from '../contexts/SettingsContext';
import { loadSounds, unloadSounds } from '../utils/audio';

export default function RootLayout() {

  useEffect(() => {
    // Preload sounds on app start
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  return (
    <SettingsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
          animation: 'fade', // smooth transitions
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </SettingsProvider>
  );
}
