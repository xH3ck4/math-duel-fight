import type { Difficulty, Question, QuestionCategory } from '../types/game';
import { getQuestionsByLevel } from '../data/questions';
import { getLevelById } from '../data/levels';
import {
  generateQuestionByCategory,
  validateQuestion,
} from '../utils/questionGenerator';
import { GAME_CONFIG } from '../constants/gameConfig';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const QuestionService = {
  buildBattleQuestions(levelId: number, count: number = GAME_CONFIG.QUESTIONS_PER_BATTLE): Question[] {
    const level = getLevelById(levelId);
    const pool = getQuestionsByLevel(levelId).filter(validateQuestion);
    const selected: Question[] = [];

    const shuffled = shuffle(pool);
    for (const q of shuffled) {
      if (selected.length >= count) break;
      selected.push({ ...q, id: q.id + selected.length * 1000 });
    }

    while (selected.length < count) {
      const generated = generateQuestionByCategory(level.category, level.difficulty);
      if (validateQuestion(generated)) {
        selected.push({
          ...generated,
          level: levelId,
          id: Date.now() + selected.length,
        });
      }
    }

    return selected.slice(0, count);
  },

  generateOne(category: QuestionCategory, difficulty: Difficulty): Question {
    let attempts = 0;
    while (attempts < 10) {
      const q = generateQuestionByCategory(category, difficulty);
      if (validateQuestion(q)) return q;
      attempts += 1;
    }
    return generateQuestionByCategory(category, difficulty);
  },
};
