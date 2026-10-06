export type Difficulty = 'easy' | 'normal' | 'hard';

export type QuestionCategory =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mixed'
  | 'fraction'
  | 'decimal'
  | 'story';

export type GameMode = 'pvp' | 'pvc';

export type NpcDifficulty = 'easy' | 'normal' | 'hard';

export type GamePhase =
  | 'menu'
  | 'character-selection'
  | 'battle'
  | 'question'
  | 'feedback'
  | 'victory'
  | 'game-over'
  | 'paused';

export type TurnSide = 'player1' | 'player2';

export interface Question {
  id: number;
  level: number;
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  damage: number;
  timeLimit: number;
}

export interface CharacterStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string;
  accentColor: string;
  emoji: string;
  stats: CharacterStats;
}

export interface LevelInfo {
  id: number;
  name: string;
  icon: string;
  description: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  questionCount: number;
  unlockRequirement: number | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: 'first_victory' }
  | { type: 'correct_answers'; count: number }
  | { type: 'combo'; count: number }
  | { type: 'perfect_game' }
  | { type: 'fast_answer' }
  | { type: 'total_wins'; count: number }
  | { type: 'levels_cleared'; count: number };

export interface BattlePlayer {
  id: TurnSide;
  name: string;
  characterId: string;
  isNpc: boolean;
  hp: number;
  maxHp: number;
  score: number;
  combo: number;
  highestCombo: number;
  correctAnswers: number;
  wrongAnswers: number;
  damageDealt: number;
  damageReceived: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface FeedbackState {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  damage: number;
  scoreGained: number;
  isTimeout: boolean;
}

export interface BattleResult {
  winner: TurnSide | 'draw';
  player1: BattlePlayer;
  player2: BattlePlayer;
  timePlayedSeconds: number;
  stars: number;
  evaluation: string;
  levelId: number;
  mode: GameMode;
  hadFastAnswer: boolean;
}

export interface PlayerProfile {
  playerName: string;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  highestScore: number;
  highestCombo: number;
  totalCorrect: number;
  totalWrong: number;
  unlockedLevels: number[];
  levelBestScores: Record<string, number>;
  levelStars: Record<string, number>;
  unlockedAchievements: string[];
  hasFastAnswer: boolean;
  hasPerfectGame: boolean;
}

export interface AppSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'id' | 'en';
}

export type RootStackParamList = {
  Splash: undefined;
  MainMenu: undefined;
  ModeSelection: undefined;
  LevelSelection: undefined;
  CharacterSelection: undefined;
  PlayerSetup: undefined;
  Battle: undefined;
  Result: undefined;
  HowToPlay: undefined;
  Profile: undefined;
  Achievement: undefined;
  Settings: undefined;
  About: undefined;
};
