import { Audio } from 'expo-av';

let sounds: { [key: string]: Audio.Sound } = {};

export const loadSounds = async () => {
  try {
    const { sound: flipSound } = await Audio.Sound.createAsync(require('../assets/sounds/flip.ogg'));
    const { sound: successSound } = await Audio.Sound.createAsync(require('../assets/sounds/success.ogg'));
    const { sound: errorSound } = await Audio.Sound.createAsync(require('../assets/sounds/error.ogg'));
    const { sound: clickSound } = await Audio.Sound.createAsync(require('../assets/sounds/click.ogg'));

    sounds = {
      flip: flipSound,
      success: successSound,
      error: errorSound,
      click: clickSound,
    };
  } catch (error) {
    console.warn('Failed to load sounds', error);
  }
};

export const playSound = async (name: 'flip' | 'success' | 'error' | 'click', enabled: boolean) => {
  if (!enabled || !sounds[name]) return;
  try {
    await sounds[name].setPositionAsync(0);
    await sounds[name].playAsync();
  } catch (error) {
    console.warn(`Error playing sound: ${name}`, error);
  }
};

export const unloadSounds = async () => {
  for (const sound of Object.values(sounds)) {
    await sound.unloadAsync();
  }
  sounds = {};
};
