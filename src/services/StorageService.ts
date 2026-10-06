import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/gameConfig';
import type { AppSettings, PlayerProfile } from '../types/game';

export const DEFAULT_PROFILE: PlayerProfile = {
  playerName: 'Pemain',
  totalGames: 0,
  totalWins: 0,
  totalLosses: 0,
  highestScore: 0,
  highestCombo: 0,
  totalCorrect: 0,
  totalWrong: 0,
  unlockedLevels: [1],
  levelBestScores: {},
  levelStars: {},
  unlockedAchievements: [],
  hasFastAnswer: false,
  hasPerfectGame: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  musicEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'id',
};

async function safeGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

async function safeSet(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors — keep app running offline
  }
}

export const StorageService = {
  async loadProfile(): Promise<PlayerProfile> {
    const profile = await safeGet(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    if (!profile.unlockedLevels?.length) {
      profile.unlockedLevels = [1];
    }
    return profile;
  },

  async saveProfile(profile: PlayerProfile): Promise<void> {
    await safeSet(STORAGE_KEYS.PROFILE, profile);
  },

  async loadSettings(): Promise<AppSettings> {
    return safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  async saveGameData(data: { profile: PlayerProfile; settings: AppSettings }): Promise<void> {
    await Promise.all([
      this.saveProfile(data.profile),
      this.saveSettings(data.settings),
    ]);
  },

  async loadGameData(): Promise<{ profile: PlayerProfile; settings: AppSettings }> {
    const [profile, settings] = await Promise.all([
      this.loadProfile(),
      this.loadSettings(),
    ]);
    return { profile, settings };
  },

  async saveProgress(profile: PlayerProfile): Promise<void> {
    await this.saveProfile(profile);
  },

  async loadProgress(): Promise<PlayerProfile> {
    return this.loadProfile();
  },

  async resetProgress(): Promise<void> {
    await this.saveProfile(DEFAULT_PROFILE);
  },
};
