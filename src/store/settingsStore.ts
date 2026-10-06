import { create } from 'zustand';
import type { AppSettings } from '../types/game';
import { DEFAULT_SETTINGS, StorageService } from '../services/StorageService';
import { AudioManager } from '../services/AudioManager';

interface SettingsState extends AppSettings {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setMusicEnabled: (v: boolean) => Promise<void>;
  setSoundEnabled: (v: boolean) => Promise<void>;
  setVibrationEnabled: (v: boolean) => Promise<void>;
  setLanguage: (lang: 'id' | 'en') => Promise<void>;
  persist: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    const settings = await StorageService.loadSettings();
    AudioManager.setMusicEnabled(settings.musicEnabled);
    AudioManager.setSoundEnabled(settings.soundEnabled);
    AudioManager.setVibrationEnabled(settings.vibrationEnabled);
    set({ ...settings, hydrated: true });
  },

  persist: async () => {
    const { musicEnabled, soundEnabled, vibrationEnabled, language } = get();
    await StorageService.saveSettings({
      musicEnabled,
      soundEnabled,
      vibrationEnabled,
      language,
    });
  },

  setMusicEnabled: async (v) => {
    AudioManager.setMusicEnabled(v);
    set({ musicEnabled: v });
    await get().persist();
    if (v) await AudioManager.playBgm('menu');
    else await AudioManager.stopMusic();
  },

  setSoundEnabled: async (v) => {
    AudioManager.setSoundEnabled(v);
    set({ soundEnabled: v });
    await get().persist();
  },

  setVibrationEnabled: async (v) => {
    AudioManager.setVibrationEnabled(v);
    set({ vibrationEnabled: v });
    await get().persist();
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    await get().persist();
  },
}));
