import type { Difficulty } from '../types/game';

export const GAME_CONFIG = {
  MAX_HP: 100,
  SELF_DAMAGE: 10,
  QUESTIONS_PER_BATTLE: 10,
  FEEDBACK_DURATION_MS: 1800,
  TURN_TRANSITION_MS: 800,
  SPLASH_DURATION_MS: 2200,

  DAMAGE: {
    easy: 10,
    normal: 20,
    hard: 30,
  } as Record<Difficulty, number>,

  TIMER: {
    easy: 15,
    normal: 10,
    hard: 8,
  } as Record<Difficulty, number>,

  SCORE: {
    easy: 100,
    normal: 200,
    hard: 300,
    wrongPenalty: 50,
    speedBonusUnder3: 50,
    speedBonusUnder5: 25,
  },

  NPC: {
    easy: { accuracy: 0.6, delayMin: 3000, delayMax: 5000 },
    normal: { accuracy: 0.75, delayMin: 2000, delayMax: 4000 },
    hard: { accuracy: 0.9, delayMin: 1000, delayMax: 3000 },
  },

  STAR_THRESHOLDS: {
    one: 300,
    two: 800,
    three: 1500,
  },
} as const;

export const STORAGE_KEYS = {
  PROFILE: '@math_duel/profile',
  SETTINGS: '@math_duel/settings',
  PROGRESS: '@math_duel/progress',
} as const;
