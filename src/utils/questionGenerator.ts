import type { Difficulty, Question, QuestionCategory } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueOptions(correct: string, distractors: string[]): string[] {
  const set = new Set<string>([correct]);
  for (const d of distractors) {
    if (d !== correct && !set.has(d) && d.length > 0) {
      set.add(d);
    }
    if (set.size >= 4) break;
  }
  let guard = 0;
  while (set.size < 4 && guard < 50) {
    const n = Number(correct);
    if (!Number.isNaN(n)) {
      set.add(String(n + randInt(1, 20) * (Math.random() > 0.5 ? 1 : -1)));
    } else {
      set.add(`${correct}_${guard}`);
    }
    guard += 1;
  }
  return shuffle([...set]).slice(0, 4);
}

function meta(difficulty: Difficulty) {
  return {
    damage: GAME_CONFIG.DAMAGE[difficulty],
    timeLimit: GAME_CONFIG.TIMER[difficulty],
  };
}

export function generateAdditionQuestion(difficulty: Difficulty = 'easy'): Question {
  let a: number;
  let b: number;
  if (difficulty === 'easy') {
    a = randInt(10, 99);
    b = randInt(10, 99);
  } else if (difficulty === 'normal') {
    a = randInt(100, 499);
    b = randInt(100, 499);
  } else {
    a = randInt(200, 999);
    b = randInt(200, 999);
  }
  const answer = a + b;
  const options = uniqueOptions(String(answer), [
    String(answer + 10),
    String(answer - 10),
    String(answer + 1),
    String(a + b + 20),
    String(a + b - 20),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 1,
    category: 'addition',
    difficulty,
    question: `${a} + ${b} = ?`,
    options,
    answer: String(answer),
    explanation: `${a} + ${b} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateSubtractionQuestion(difficulty: Difficulty = 'easy'): Question {
  let a: number;
  let b: number;
  if (difficulty === 'easy') {
    a = randInt(20, 99);
    b = randInt(1, a);
  } else if (difficulty === 'normal') {
    a = randInt(100, 500);
    b = randInt(10, a);
  } else {
    a = randInt(300, 999);
    b = randInt(50, a);
  }
  const answer = a - b;
  const options = uniqueOptions(String(answer), [
    String(answer + 10),
    String(Math.max(0, answer - 10)),
    String(a + b),
    String(Math.abs(b - a)),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 2,
    category: 'subtraction',
    difficulty,
    question: `${a} − ${b} = ?`,
    options,
    answer: String(answer),
    explanation: `${a} − ${b} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateMultiplicationQuestion(difficulty: Difficulty = 'normal'): Question {
  let a: number;
  let b: number;
  if (difficulty === 'easy') {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } else if (difficulty === 'normal') {
    a = randInt(6, 12);
    b = randInt(3, 12);
  } else {
    a = randInt(11, 25);
    b = randInt(4, 12);
  }
  const answer = a * b;
  const options = uniqueOptions(String(answer), [
    String(answer + a),
    String(answer - a),
    String(a * (b + 1)),
    String(a * Math.max(1, b - 1)),
    String((a + 1) * b),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 3,
    category: 'multiplication',
    difficulty,
    question: `${a} × ${b} = ?`,
    options,
    answer: String(answer),
    explanation: `${a} × ${b} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateDivisionQuestion(difficulty: Difficulty = 'normal'): Question {
  let b: number;
  let answer: number;
  if (difficulty === 'easy') {
    b = randInt(2, 9);
    answer = randInt(2, 9);
  } else if (difficulty === 'normal') {
    b = randInt(3, 12);
    answer = randInt(4, 15);
  } else {
    b = randInt(5, 15);
    answer = randInt(6, 20);
  }
  const a = b * answer;
  const options = uniqueOptions(String(answer), [
    String(answer + 1),
    String(Math.max(1, answer - 1)),
    String(answer + 2),
    String(b),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 4,
    category: 'division',
    difficulty,
    question: `${a} ÷ ${b} = ?`,
    options,
    answer: String(answer),
    explanation: `${a} ÷ ${b} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateMixedQuestion(difficulty: Difficulty = 'normal'): Question {
  const a = randInt(2, 12);
  const b = randInt(2, 9);
  const c = randInt(5, 40);
  const answer = a * b + c;
  const options = uniqueOptions(String(answer), [
    String(a * b - c > 0 ? a * b - c : a * b + c + 5),
    String(a + b + c),
    String(a * (b + c)),
    String(answer + 10),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 5,
    category: 'mixed',
    difficulty,
    question: `${a} × ${b} + ${c} = ?`,
    options,
    answer: String(answer),
    explanation: `${a} × ${b} = ${a * b}, lalu ${a * b} + ${c} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateFractionQuestion(difficulty: Difficulty = 'hard'): Question {
  const denom = [2, 3, 4, 5, 6, 8][randInt(0, 5)];
  const n1 = randInt(1, denom - 1);
  const n2 = randInt(1, denom - n1);
  const answerNum = n1 + n2;
  const answer =
    answerNum === denom ? '1' : answerNum > denom ? `1 ${answerNum - denom}/${denom}` : `${answerNum}/${denom}`;
  const wrong1 = `${Math.max(1, answerNum - 1)}/${denom}`;
  const wrong2 = `${answerNum + 1}/${denom}`;
  const wrong3 = `${n1 + n2}/${denom + 1}`;
  const options = uniqueOptions(answer, [wrong1, wrong2, wrong3, `${n1}/${denom}`]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 6,
    category: 'fraction',
    difficulty,
    question: `${n1}/${denom} + ${n2}/${denom} = ?`,
    options,
    answer,
    explanation: `${n1}/${denom} + ${n2}/${denom} = ${answerNum}/${denom}${answerNum === denom ? ' = 1' : ''}`,
    ...meta(difficulty),
  };
}

export function generateDecimalQuestion(difficulty: Difficulty = 'hard'): Question {
  const a = (randInt(10, 99) / 10).toFixed(1);
  const b = (randInt(10, 99) / 10).toFixed(1);
  const answer = (Number(a) + Number(b)).toFixed(1);
  const options = uniqueOptions(answer, [
    (Number(answer) + 0.1).toFixed(1),
    (Number(answer) - 0.1).toFixed(1),
    (Number(answer) + 1).toFixed(1),
    (Number(a) * Number(b)).toFixed(1),
  ]);
  return {
    id: Date.now() + randInt(1, 9999),
    level: 7,
    category: 'decimal',
    difficulty,
    question: `${a} + ${b} = ?`,
    options,
    answer,
    explanation: `${a} + ${b} = ${answer}`,
    ...meta(difficulty),
  };
}

export function generateStoryQuestion(difficulty: Difficulty = 'hard'): Question {
  const templates = [
    () => {
      const pensil = randInt(12, 48);
      const box = randInt(3, 8);
      const answer = pensil * box;
      return {
        question: `Sebuah toko punya ${box} kotak pensil. Tiap kotak berisi ${pensil} pensil. Berapa total pensil?`,
        answer: String(answer),
        explanation: `${box} × ${pensil} = ${answer}`,
        distractors: [String(answer + pensil), String(pensil + box), String(answer - box)],
      };
    },
    () => {
      const total = randInt(40, 120);
      const given = randInt(10, Math.floor(total / 2));
      const answer = total - given;
      return {
        question: `Ani punya ${total} kelereng. Ia memberi ${given} kelereng ke Budi. Berapa sisa kelereng Ani?`,
        answer: String(answer),
        explanation: `${total} − ${given} = ${answer}`,
        distractors: [String(total + given), String(given), String(answer + 5)],
      };
    },
    () => {
      const pages = randInt(5, 20);
      const days = randInt(3, 7);
      const answer = pages * days;
      return {
        question: `Rani membaca ${pages} halaman setiap hari selama ${days} hari. Berapa total halaman yang dibaca?`,
        answer: String(answer),
        explanation: `${pages} × ${days} = ${answer}`,
        distractors: [String(pages + days), String(answer + pages), String(Math.max(1, answer - days))],
      };
    },
  ];
  const t = templates[randInt(0, templates.length - 1)]();
  return {
    id: Date.now() + randInt(1, 9999),
    level: 8,
    category: 'story',
    difficulty,
    question: t.question,
    options: uniqueOptions(t.answer, t.distractors),
    answer: t.answer,
    explanation: t.explanation,
    ...meta(difficulty),
  };
}

const GENERATORS: Record<QuestionCategory, (d: Difficulty) => Question> = {
  addition: generateAdditionQuestion,
  subtraction: generateSubtractionQuestion,
  multiplication: generateMultiplicationQuestion,
  division: generateDivisionQuestion,
  mixed: generateMixedQuestion,
  fraction: generateFractionQuestion,
  decimal: generateDecimalQuestion,
  story: generateStoryQuestion,
};

export function generateQuestionByCategory(
  category: QuestionCategory,
  difficulty: Difficulty,
): Question {
  return GENERATORS[category](difficulty);
}

export function validateQuestion(q: Question): boolean {
  if (!q.question || !q.answer || !q.options || q.options.length !== 4) return false;
  if (!q.options.includes(q.answer)) return false;
  if (new Set(q.options).size !== 4) return false;
  return true;
}
