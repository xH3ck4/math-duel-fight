import { GAME_CONFIG } from '../constants/gameConfig';

export function clampHp(hp: number, maxHp: number = GAME_CONFIG.MAX_HP): number {
  if (Number.isNaN(hp)) return 0;
  return Math.max(0, Math.min(maxHp, hp));
}

export function calcAttackDamage(
  baseDamage: number,
  attackerAttack: number,
  defenderDefense: number,
): number {
  const attackBonus = Math.floor((attackerAttack - 20) / 4);
  const defenseReduce = Math.floor((defenderDefense - 15) / 5);
  return Math.max(5, baseDamage + attackBonus - defenseReduce);
}

export function calcSelfDamage(base: number, defense: number): number {
  const reduce = Math.floor((defense - 15) / 5);
  return Math.max(5, base - reduce);
}

export function getHpColor(ratio: number): 'high' | 'mid' | 'low' {
  if (ratio > 0.5) return 'high';
  if (ratio > 0.25) return 'mid';
  return 'low';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getEvaluation(stars: number): string {
  if (stars >= 3) return 'Hebat!';
  if (stars === 2) return 'Bagus, terus berlatih!';
  return 'Coba lagi untuk meningkatkan skor!';
}

export function calcStars(score: number): number {
  if (score >= GAME_CONFIG.STAR_THRESHOLDS.three) return 3;
  if (score >= GAME_CONFIG.STAR_THRESHOLDS.two) return 2;
  if (score >= GAME_CONFIG.STAR_THRESHOLDS.one) return 1;
  return 0;
}

export function accuracyPercent(correct: number, wrong: number): number {
  const total = correct + wrong;
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
