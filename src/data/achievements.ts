import type { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Menang pertama kali.',
    icon: '🏆',
    condition: { type: 'first_victory' },
  },
  {
    id: 'math_rookie',
    title: 'Math Rookie',
    description: 'Menjawab 10 soal benar.',
    icon: '📘',
    condition: { type: 'correct_answers', count: 10 },
  },
  {
    id: 'math_master',
    title: 'Math Master',
    description: 'Menjawab 50 soal benar.',
    icon: '📗',
    condition: { type: 'correct_answers', count: 50 },
  },
  {
    id: 'combo_king',
    title: 'Combo King',
    description: 'Mendapat combo x5.',
    icon: '🔥',
    condition: { type: 'combo', count: 5 },
  },
  {
    id: 'perfect',
    title: 'Perfect',
    description: 'Menyelesaikan pertandingan tanpa salah.',
    icon: '💎',
    condition: { type: 'perfect_game' },
  },
  {
    id: 'fast_thinker',
    title: 'Fast Thinker',
    description: 'Menjawab soal dalam waktu kurang dari 3 detik.',
    icon: '⚡',
    condition: { type: 'fast_answer' },
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Menang 10 pertandingan.',
    icon: '👑',
    condition: { type: 'total_wins', count: 10 },
  },
  {
    id: 'explorer',
    title: 'Level Explorer',
    description: 'Membuka 4 level.',
    icon: '🗺️',
    condition: { type: 'levels_cleared', count: 4 },
  },
];
