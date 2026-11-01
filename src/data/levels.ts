import type { LevelInfo } from '../types/game';

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    name: 'Penyebut Sama',
    icon: '🥧',
    description: 'Penjumlahan & pengurangan pecahan dengan penyebut yang sama.',
    category: 'fraction_like',
    difficulty: 'easy',
    questionCount: 10,
    unlockRequirement: null,
  },
  {
    id: 2,
    name: 'Penyebut Berbeda',
    icon: '📐',
    description: 'Samakan penyebut dengan KPK sebelum dijumlah atau dikurangkan.',
    category: 'fraction_unlike',
    difficulty: 'normal',
    questionCount: 10,
    unlockRequirement: null,
  },
  {
    id: 3,
    name: 'Pecahan Campuran',
    icon: '🥞',
    description: 'Penjumlahan dan pengurangan pecahan campuran secara teliti.',
    category: 'fraction_mixed',
    difficulty: 'normal',
    questionCount: 10,
    unlockRequirement: null,
  },
  {
    id: 4,
    name: 'Numerasi & Cerita',
    icon: '📜',
    description: 'Soal cerita kehidupan sehari-hari. Waktu berpikir 2 menit!',
    category: 'fraction_story',
    difficulty: 'hard',
    questionCount: 10,
    unlockRequirement: null,
  },
];

export const LEVEL_IDS = LEVELS.map((l) => l.id);

export function getLevelById(id: number): LevelInfo {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}
