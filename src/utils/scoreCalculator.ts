import type { Difficulty } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';

export function calcAnswerScore(params: {
  isCorrect: boolean;
  difficulty: Difficulty;
  combo: number;
  timeTaken: number;
  timeLimit: number;
  speedBonusMultiplier?: number;
}): { scoreDelta: number; newCombo: number; multiplier: number } {
  const { isCorrect, difficulty, combo, timeTaken, speedBonusMultiplier = 1 } = params;

  if (!isCorrect) {
    return {
      scoreDelta: -GAME_CONFIG.SCORE.wrongPenalty,
      newCombo: 0,
      multiplier: 1,
    };
  }

  const newCombo = combo + 1;
  const multiplier = Math.min(4, Math.max(1, newCombo));
  let base = GAME_CONFIG.SCORE[difficulty];

  if (timeTaken < 3) {
    base += Math.round(GAME_CONFIG.SCORE.speedBonusUnder3 * speedBonusMultiplier);
  } else if (timeTaken < 5) {
    base += Math.round(GAME_CONFIG.SCORE.speedBonusUnder5 * speedBonusMultiplier);
  }

  const scoreDelta = base * multiplier;
  return { scoreDelta, newCombo, multiplier };
}

export function safeScore(score: number): number {
  if (Number.isNaN(score) || !Number.isFinite(score)) return 0;
  return Math.max(0, Math.round(score));
}
