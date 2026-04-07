import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextData {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (value: boolean) => void;
  lowPerformanceMode: boolean;
  setLowPerformanceMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextData>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  vibrationEnabled: true,
  setVibrationEnabled: () => {},
  lowPerformanceMode: false,
  setLowPerformanceMode: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        vibrationEnabled,
        setVibrationEnabled,
        lowPerformanceMode,
        setLowPerformanceMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
