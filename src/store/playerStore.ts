import { create } from 'zustand';
import { ACHIEVEMENTS } from '../data/achievements';
import type { BattleResult, PlayerProfile } from '../types/game';
import { DEFAULT_PROFILE, StorageService } from '../services/StorageService';
import { accuracyPercent } from '../utils/gameUtils';

interface PlayerState {
  profile: PlayerProfile;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setPlayerName: (name: string) => Promise<void>;
  applyBattleResult: (result: BattleResult, localPlayer: 'player1' | 'player2') => Promise<string[]>;
  unlockLevel: (levelId: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  getAccuracy: () => number;
}

function checkAchievements(profile: PlayerProfile): string[] {
  const newly: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (profile.unlockedAchievements.includes(ach.id)) continue;
    let unlocked = false;
    const c = ach.condition;
    switch (c.type) {
      case 'first_victory':
        unlocked = profile.totalWins >= 1;
        break;
      case 'correct_answers':
        unlocked = profile.totalCorrect >= c.count;
        break;
      case 'combo':
        unlocked = profile.highestCombo >= c.count;
        break;
      case 'perfect_game':
        unlocked = profile.hasPerfectGame;
        break;
      case 'fast_answer':
        unlocked = profile.hasFastAnswer;
        break;
      case 'total_wins':
        unlocked = profile.totalWins >= c.count;
        break;
      case 'levels_cleared':
        unlocked = profile.unlockedLevels.length >= c.count;
        break;
      default:
        break;
    }
    if (unlocked) newly.push(ach.id);
  }
  return newly;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  hydrated: false,

  hydrate: async () => {
    const profile = await StorageService.loadProfile();
    set({ profile, hydrated: true });
  },

  setPlayerName: async (name) => {
    const profile = { ...get().profile, playerName: name.trim() || 'Pemain' };
    set({ profile });
    await StorageService.saveProfile(profile);
  },

  unlockLevel: async (levelId) => {
    const profile = { ...get().profile };
    if (!profile.unlockedLevels.includes(levelId)) {
      profile.unlockedLevels = [...profile.unlockedLevels, levelId].sort((a, b) => a - b);
      set({ profile });
      await StorageService.saveProfile(profile);
    }
  },

  applyBattleResult: async (result, localPlayer) => {
    const profile = { ...get().profile };
    const me = localPlayer === 'player1' ? result.player1 : result.player2;
    const won = result.winner === localPlayer;

    profile.totalGames += 1;
    if (won) profile.totalWins += 1;
    else if (result.winner !== 'draw') profile.totalLosses += 1;

    profile.totalCorrect += me.correctAnswers;
    profile.totalWrong += me.wrongAnswers;
    profile.highestScore = Math.max(profile.highestScore, me.score);
    profile.highestCombo = Math.max(profile.highestCombo, me.highestCombo);

    if (me.wrongAnswers === 0 && me.correctAnswers > 0) {
      profile.hasPerfectGame = true;
    }
    if (result.hadFastAnswer) {
      profile.hasFastAnswer = true;
    }

    const key = String(result.levelId);
    const prevBest = profile.levelBestScores[key] ?? 0;
    if (me.score > prevBest) {
      profile.levelBestScores[key] = me.score;
    }
    const prevStars = profile.levelStars[key] ?? 0;
    if (result.stars > prevStars) {
      profile.levelStars[key] = result.stars;
    }

    if (won) {
      const nextLevel = result.levelId + 1;
      if (nextLevel <= 8 && !profile.unlockedLevels.includes(nextLevel)) {
        profile.unlockedLevels = [...profile.unlockedLevels, nextLevel].sort((a, b) => a - b);
      }
    }

    const newly = checkAchievements(profile);
    if (newly.length) {
      profile.unlockedAchievements = [...profile.unlockedAchievements, ...newly];
    }

    set({ profile });
    await StorageService.saveProfile(profile);
    return newly;
  },

  resetProgress: async () => {
    await StorageService.resetProgress();
    set({ profile: { ...DEFAULT_PROFILE } });
  },

  getAccuracy: () => {
    const { totalCorrect, totalWrong } = get().profile;
    return accuracyPercent(totalCorrect, totalWrong);
  },
}));
