import type { Character } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';

export const CHARACTERS: Character[] = [
  {
    id: 'kai',
    name: 'Kai',
    title: 'Balanced Fighter',
    description: 'Petarung seimbang. Cocok untuk pemula yang ingin bermain stabil.',
    color: '#2B6CB0',
    accentColor: '#8EC5FF',
    emoji: 'kai',
    stats: {
      hp: GAME_CONFIG.MAX_HP,
      attack: 20,
      defense: 15,
      speed: 15,
    },
  },
  {
    id: 'raka',
    name: 'Raka',
    title: 'Strong Fighter',
    description: 'Serangan kuat. Damage lebih besar saat jawaban benar.',
    color: '#E6392B',
    accentColor: '#FF8A7A',
    emoji: 'raka',
    stats: {
      hp: GAME_CONFIG.MAX_HP,
      attack: 28,
      defense: 12,
      speed: 10,
    },
  },
  {
    id: 'naya',
    name: 'Naya',
    title: 'Fast Fighter',
    description: 'Cepat dan lincah. Bonus skor kecepatan lebih besar.',
    color: '#E08900',
    accentColor: '#FFC857',
    emoji: 'naya',
    stats: {
      hp: GAME_CONFIG.MAX_HP,
      attack: 18,
      defense: 12,
      speed: 28,
    },
  },
  {
    id: 'zara',
    name: 'Zara',
    title: 'Smart Fighter',
    description: 'Strategis. Defense tinggi mengurangi self-damage.',
    color: '#2B9B8A',
    accentColor: '#6FD9C7',
    emoji: 'zara',
    stats: {
      hp: GAME_CONFIG.MAX_HP,
      attack: 16,
      defense: 25,
      speed: 14,
    },
  },
];

export function getCharacterById(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
