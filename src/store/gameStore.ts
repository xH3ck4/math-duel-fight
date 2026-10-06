import { create } from 'zustand';
import { getCharacterById } from '../data/characters';
import { GAME_CONFIG } from '../constants/gameConfig';
import { QuestionService } from '../services/QuestionService';
import type {
  BattlePlayer,
  BattleResult,
  FeedbackState,
  GameMode,
  GamePhase,
  NpcDifficulty,
  Question,
  TurnSide,
} from '../types/game';
import {
  accuracyPercent,
  calcAttackDamage,
  calcSelfDamage,
  calcStars,
  clampHp,
  getEvaluation,
  randomBetween,
} from '../utils/gameUtils';
import { calcAnswerScore, safeScore } from '../utils/scoreCalculator';

function createBattlePlayer(
  id: TurnSide,
  name: string,
  characterId: string,
  isNpc: boolean,
): BattlePlayer {
  const character = getCharacterById(characterId);
  return {
    id,
    name,
    characterId,
    isNpc,
    hp: character.stats.hp,
    maxHp: character.stats.hp,
    score: 0,
    combo: 0,
    highestCombo: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    damageDealt: 0,
    damageReceived: 0,
    attack: character.stats.attack,
    defense: character.stats.defense,
    speed: character.stats.speed,
  };
}

interface GameState {
  mode: GameMode;
  npcDifficulty: NpcDifficulty;
  levelId: number;
  player1CharacterId: string;
  player2CharacterId: string;
  player1Name: string;
  player2Name: string;

  player1: BattlePlayer | null;
  player2: BattlePlayer | null;
  currentTurn: TurnSide;
  questions: Question[];
  questionIndex: number;
  currentQuestion: Question | null;
  timeRemaining: number;
  questionStartedAt: number;
  gamePhase: GamePhase;
  feedback: FeedbackState | null;
  battleLog: string[];
  battleStartAt: number;
  lastDamage: { target: TurnSide; amount: number } | null;
  result: BattleResult | null;
  isAnswering: boolean;
  hadFastAnswer: boolean;

  setMode: (mode: GameMode) => void;
  setNpcDifficulty: (d: NpcDifficulty) => void;
  setLevelId: (id: number) => void;
  setPlayer1Character: (id: string) => void;
  setPlayer2Character: (id: string) => void;
  setPlayerNames: (p1: string, p2: string) => void;
  startBattle: () => void;
  tickTimer: () => void;
  submitAnswer: (answer: string | null, isTimeout?: boolean) => void;
  clearFeedbackAndContinue: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetBattle: () => void;
  getActivePlayer: () => BattlePlayer | null;
  getOpponent: () => BattlePlayer | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'pvp',
  npcDifficulty: 'normal',
  levelId: 1,
  player1CharacterId: 'kai',
  player2CharacterId: 'raka',
  player1Name: 'Player 1',
  player2Name: 'Player 2',

  player1: null,
  player2: null,
  currentTurn: 'player1',
  questions: [],
  questionIndex: 0,
  currentQuestion: null,
  timeRemaining: 10,
  questionStartedAt: 0,
  gamePhase: 'menu',
  feedback: null,
  battleLog: [],
  battleStartAt: 0,
  lastDamage: null,
  result: null,
  isAnswering: false,
  hadFastAnswer: false,

  setMode: (mode) =>
    set({
      mode,
      player2Name: mode === 'pvc' ? 'Komputer' : 'Player 2',
    }),

  setNpcDifficulty: (npcDifficulty) => set({ npcDifficulty }),
  setLevelId: (levelId) => set({ levelId }),
  setPlayer1Character: (player1CharacterId) => set({ player1CharacterId }),
  setPlayer2Character: (player2CharacterId) => set({ player2CharacterId }),
  setPlayerNames: (player1Name, player2Name) => set({ player1Name, player2Name }),

  getActivePlayer: () => {
    const { currentTurn, player1, player2 } = get();
    return currentTurn === 'player1' ? player1 : player2;
  },

  getOpponent: () => {
    const { currentTurn, player1, player2 } = get();
    return currentTurn === 'player1' ? player2 : player1;
  },

  startBattle: () => {
    const state = get();
    const questions = QuestionService.buildBattleQuestions(state.levelId);
    const p1 = createBattlePlayer('player1', state.player1Name, state.player1CharacterId, false);
    const p2 = createBattlePlayer(
      'player2',
      state.mode === 'pvc' ? 'Komputer' : state.player2Name,
      state.player2CharacterId,
      state.mode === 'pvc',
    );
    const first = questions[0];
    set({
      player1: p1,
      player2: p2,
      questions,
      questionIndex: 0,
      currentQuestion: first,
      currentTurn: 'player1',
      timeRemaining: first?.timeLimit ?? 10,
      questionStartedAt: Date.now(),
      gamePhase: 'question',
      feedback: null,
      battleLog: ['Pertandingan dimulai!'],
      battleStartAt: Date.now(),
      lastDamage: null,
      result: null,
      isAnswering: false,
      hadFastAnswer: false,
    });
  },

  tickTimer: () => {
    const { gamePhase, timeRemaining, isAnswering } = get();
    if (gamePhase !== 'question' || isAnswering) return;
    if (timeRemaining <= 1) {
      get().submitAnswer(null, true);
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  submitAnswer: (answer, isTimeout = false) => {
    const state = get();
    if (state.gamePhase !== 'question' || state.isAnswering || !state.currentQuestion) return;
    if (!state.player1 || !state.player2) return;

    const question = state.currentQuestion;
    const active = state.currentTurn === 'player1' ? { ...state.player1 } : { ...state.player2 };
    const opponent = state.currentTurn === 'player1' ? { ...state.player2 } : { ...state.player1 };

    const isCorrect = !isTimeout && answer === question.answer;
    const timeTaken = Math.max(0, (Date.now() - state.questionStartedAt) / 1000);
    const speedMul = active.speed >= 25 ? 1.5 : 1;

    const { scoreDelta, newCombo, multiplier } = calcAnswerScore({
      isCorrect,
      difficulty: question.difficulty,
      combo: active.combo,
      timeTaken,
      timeLimit: question.timeLimit,
      speedBonusMultiplier: speedMul,
    });

    let damage = 0;
    const log = [...state.battleLog];

    if (isCorrect) {
      damage = calcAttackDamage(question.damage, active.attack, opponent.defense);
      opponent.hp = clampHp(opponent.hp - damage, opponent.maxHp);
      opponent.damageReceived += damage;
      active.damageDealt += damage;
      active.correctAnswers += 1;
      active.combo = newCombo;
      active.highestCombo = Math.max(active.highestCombo, newCombo);
      active.score = safeScore(active.score + scoreDelta);
      log.push(`${active.name} BENAR! Serangan ${damage} HP (x${multiplier})`);
    } else {
      damage = calcSelfDamage(GAME_CONFIG.SELF_DAMAGE, active.defense);
      active.hp = clampHp(active.hp - damage, active.maxHp);
      active.damageReceived += damage;
      active.wrongAnswers += 1;
      active.combo = 0;
      active.score = safeScore(active.score + scoreDelta);
      log.push(
        isTimeout
          ? `${active.name}: Waktu habis! Self-damage ${damage}`
          : `${active.name} SALAH! Self-damage ${damage}`,
      );
    }

    const feedback: FeedbackState = {
      isCorrect,
      selectedAnswer: answer ?? '-',
      correctAnswer: question.answer,
      explanation: question.explanation,
      damage,
      scoreGained: scoreDelta,
      isTimeout,
    };

    const nextPlayers =
      state.currentTurn === 'player1'
        ? { player1: active, player2: opponent }
        : { player1: opponent, player2: active };

    set({
      ...nextPlayers,
      feedback,
      battleLog: log.slice(-8),
      gamePhase: 'feedback',
      isAnswering: true,
      hadFastAnswer: state.hadFastAnswer || (isCorrect && timeTaken < 3),
      lastDamage: {
        target: isCorrect ? opponent.id : active.id,
        amount: damage,
      },
    });
  },

  clearFeedbackAndContinue: () => {
    const state = get();
    if (!state.player1 || !state.player2) return;

    const p1Dead = state.player1.hp <= 0;
    const p2Dead = state.player2.hp <= 0;

    if (p1Dead || p2Dead) {
      let winner: TurnSide | 'draw' = 'draw';
      if (p1Dead && !p2Dead) winner = 'player2';
      else if (p2Dead && !p1Dead) winner = 'player1';
      else if (state.player1.score !== state.player2.score) {
        winner = state.player1.score > state.player2.score ? 'player1' : 'player2';
      }

      const winnerPlayer = winner === 'player1' ? state.player1 : state.player2;
      const stars = calcStars(winnerPlayer.score);
      const timePlayedSeconds = Math.floor((Date.now() - state.battleStartAt) / 1000);

      const result: BattleResult = {
        winner,
        player1: state.player1,
        player2: state.player2,
        timePlayedSeconds,
        stars,
        evaluation: getEvaluation(stars),
        levelId: state.levelId,
        mode: state.mode,
        hadFastAnswer: state.hadFastAnswer,
      };

      set({
        gamePhase: winner === 'draw' ? 'game-over' : 'victory',
        result,
        feedback: null,
        isAnswering: false,
        currentQuestion: null,
      });
      return;
    }

    const nextIndex = state.questionIndex + 1;
    if (nextIndex >= state.questions.length) {
      const winner: TurnSide | 'draw' =
        state.player1.score === state.player2.score
          ? 'draw'
          : state.player1.score > state.player2.score
            ? 'player1'
            : 'player2';
      const winnerPlayer = winner === 'player2' ? state.player2 : state.player1;
      const stars = calcStars(winnerPlayer.score);
      const result: BattleResult = {
        winner,
        player1: state.player1,
        player2: state.player2,
        timePlayedSeconds: Math.floor((Date.now() - state.battleStartAt) / 1000),
        stars,
        evaluation: getEvaluation(stars),
        levelId: state.levelId,
        mode: state.mode,
        hadFastAnswer: state.hadFastAnswer,
      };
      set({
        gamePhase: winner === 'draw' ? 'game-over' : 'victory',
        result,
        feedback: null,
        isAnswering: false,
        currentQuestion: null,
      });
      return;
    }

    const nextTurn: TurnSide = state.currentTurn === 'player1' ? 'player2' : 'player1';
    const nextQuestion = state.questions[nextIndex];

    set({
      currentTurn: nextTurn,
      questionIndex: nextIndex,
      currentQuestion: nextQuestion,
      timeRemaining: nextQuestion.timeLimit,
      questionStartedAt: Date.now(),
      gamePhase: 'question',
      feedback: null,
      isAnswering: false,
      lastDamage: null,
      battleLog: [...state.battleLog, `Giliran ${nextTurn === 'player1' ? state.player1.name : state.player2.name}`].slice(-8),
    });
  },

  pauseGame: () => {
    if (get().gamePhase === 'question' || get().gamePhase === 'feedback') {
      set({ gamePhase: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().gamePhase === 'paused') {
      set({
        gamePhase: get().feedback ? 'feedback' : 'question',
        questionStartedAt: Date.now(),
      });
    }
  },

  resetBattle: () => {
    set({
      player1: null,
      player2: null,
      questions: [],
      questionIndex: 0,
      currentQuestion: null,
      feedback: null,
      result: null,
      gamePhase: 'menu',
      battleLog: [],
      isAnswering: false,
      lastDamage: null,
      hadFastAnswer: false,
    });
  },
}));

export function decideNpcAnswer(
  question: Question,
  difficulty: NpcDifficulty,
): { delay: number; answer: string } {
  const cfg = GAME_CONFIG.NPC[difficulty];
  const delay = randomBetween(cfg.delayMin, cfg.delayMax);
  const correct = Math.random() < cfg.accuracy;
  if (correct) {
    return { delay, answer: question.answer };
  }
  const wrongOptions = question.options.filter((o) => o !== question.answer);
  const answer = wrongOptions[randomBetween(0, wrongOptions.length - 1)] ?? question.options[0];
  return { delay, answer };
}

export { accuracyPercent };
