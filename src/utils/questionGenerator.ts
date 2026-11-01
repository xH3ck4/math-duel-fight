import type { Difficulty, Question, QuestionCategory } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';
import {
  addFrac,
  evaluateEquation,
  frac,
  fracEquals,
  formatFrac,
  gcd,
  lcm,
  parseEquation,
  parseFrac,
  subFrac,
  type Frac,
  type FracEquation,
} from './fraction';

type AddSub = '+' | '-';

interface BuiltProblem {
  leftText: string;
  rightText: string;
  op: AddSub;
  explanation: string;
}

const LEVEL_OF: Record<QuestionCategory, number> = {
  fraction_like: 1,
  fraction_unlike: 2,
  fraction_mixed: 3,
  fraction_story: 4,
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** "2/4" -> {n: 2, d: 4}, "1 1/2" -> {n: 3, d: 2}; unlike parseFrac it does not simplify. */
function writtenFrac(text: string): Frac | null {
  const t = text.trim();
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const d = Number(mixed[3]);
    return d ? { n: Number(mixed[1]) * d + Number(mixed[2]), d } : null;
  }
  const simple = t.match(/^(\d+)\/(\d+)$/);
  if (simple) {
    const d = Number(simple[2]);
    return d ? { n: Number(simple[1]), d } : null;
  }
  return /^\d+$/.test(t) ? { n: Number(t), d: 1 } : null;
}

function randomOp(): AddSub {
  return Math.random() < 0.5 ? '+' : '-';
}

/** Random numerator in [1, d-1] that is coprime with d, so the fraction is already simplest. */
function coprimeNumerator(d: number, min = 1, max = d - 1): number {
  const choices: number[] = [];
  for (let n = min; n <= max; n += 1) {
    if (gcd(n, d) === 1) choices.push(n);
  }
  return choices.length ? pick(choices) : 1;
}

function resultText(n: number, d: number): string {
  const raw = `${n}/${d}`;
  const simplest = formatFrac(frac(n, d));
  return raw === simplest ? raw : `${raw} = ${simplest}`;
}

function simplifyNote(n: number, d: number): string {
  const raw = `${n}/${d}`;
  const simplest = formatFrac(frac(n, d));
  return raw === simplest ? '' : ` Bentuk paling sederhana: ${raw} = ${simplest}.`;
}

function verb(op: AddSub): string {
  return op === '+' ? 'jumlahkan' : 'kurangkan';
}

function buildLike(difficulty: Difficulty, forcedOp?: AddSub): BuiltProblem {
  const dens = {
    easy: [3, 4, 5, 6, 7, 8, 9],
    normal: [8, 9, 10, 11, 12],
    hard: [12, 14, 15, 16, 18, 20],
  }[difficulty];
  const d = pick(dens);
  const op = forcedOp ?? randomOp();
  let a: number;
  let b: number;
  if (op === '+') {
    a = randInt(1, d - 2);
    b = randInt(1, d - 1 - a);
  } else {
    a = randInt(2, d - 1);
    b = randInt(1, a - 1);
  }
  const r = op === '+' ? a + b : a - b;
  return {
    leftText: `${a}/${d}`,
    rightText: `${b}/${d}`,
    op,
    explanation: `Penyebutnya sama (${d}), jadi penyebut tetap dan ${verb(op)} pembilangnya: ${a} ${op} ${b} = ${r}. Hasilnya ${r}/${d}.${simplifyNote(r, d)}`,
  };
}

const UNLIKE_PAIRS: Record<Difficulty, Array<[number, number]>> = {
  easy: [[2, 4], [2, 6], [3, 6], [4, 8], [2, 8], [5, 10]],
  normal: [[2, 3], [3, 4], [2, 5], [4, 6], [3, 9], [4, 12], [6, 8]],
  hard: [[3, 5], [4, 5], [5, 6], [3, 8], [4, 10], [6, 9], [8, 12]],
};

function conversion(n: number, d: number, common: number): string {
  if (d === common) return '';
  return `${n}/${d} = ${(n * common) / d}/${common}. `;
}

function buildUnlike(difficulty: Difficulty, forcedOp?: AddSub): BuiltProblem {
  let [d1, d2] = pick(UNLIKE_PAIRS[difficulty]);
  if (Math.random() < 0.5) [d1, d2] = [d2, d1];
  const op = forcedOp ?? randomOp();
  let a = coprimeNumerator(d1);
  let b = coprimeNumerator(d2);

  if (op === '-') {
    let guard = 0;
    while (a * d2 <= b * d1 && guard < 20) {
      a = coprimeNumerator(d1);
      b = coprimeNumerator(d2);
      guard += 1;
    }
    if (a * d2 <= b * d1) {
      [a, d1, b, d2] = [b, d2, a, d1];
    }
    if (a * d2 === b * d1) {
      return buildUnlike(difficulty, '+');
    }
  }

  const common = lcm(d1, d2);
  const A = (a * common) / d1;
  const B = (b * common) / d2;
  const r = op === '+' ? A + B : A - B;
  return {
    leftText: `${a}/${d1}`,
    rightText: `${b}/${d2}`,
    op,
    explanation:
      `Penyebut berbeda, samakan dulu. KPK dari ${d1} dan ${d2} adalah ${common}. ` +
      conversion(a, d1, common) +
      conversion(b, d2, common) +
      `Maka ${A}/${common} ${op} ${B}/${common} = ${r}/${common}.${simplifyNote(r, common)}`,
  };
}

const MIXED_DENS: Record<Difficulty, Array<[number, number]>> = {
  easy: [[3, 3], [4, 4], [5, 5], [6, 6], [8, 8]],
  normal: [[2, 4], [2, 3], [3, 6], [2, 5], [4, 8]],
  hard: [[3, 4], [2, 3], [4, 6], [2, 5], [3, 5]],
};

function buildMixed(difficulty: Difficulty, forcedOp?: AddSub): BuiltProblem {
  let [d1, d2] = pick(MIXED_DENS[difficulty]);
  if (Math.random() < 0.5) [d1, d2] = [d2, d1];
  const op = forcedOp ?? randomOp();

  let w1 = randInt(1, 4);
  let w2 = randInt(1, 3);
  let a = coprimeNumerator(d1);
  let b = coprimeNumerator(d2);

  if (op === '-') {
    if (w1 <= w2) [w1, w2] = [w2 + 1, w1];
    if (difficulty !== 'hard' && a * d2 <= b * d1) {
      [a, d1, b, d2] = [b, d2, a, d1];
      if (a * d2 === b * d1) w1 += 1;
    }
  }

  const left = frac(w1 * d1 + a, d1);
  const right = frac(w2 * d2 + b, d2);
  if (op === '-' && left.n * right.d <= right.n * left.d) {
    return buildMixed(difficulty, op);
  }

  const common = lcm(d1, d2);
  const P1 = w1 * d1 + a;
  const P2 = w2 * d2 + b;
  const C1 = (P1 * common) / d1;
  const C2 = (P2 * common) / d2;
  const r = op === '+' ? C1 + C2 : C1 - C2;

  const sameDen = d1 === d2;
  return {
    leftText: `${w1} ${a}/${d1}`,
    rightText: `${w2} ${b}/${d2}`,
    op,
    explanation:
      `Ubah ke pecahan biasa: ${w1} ${a}/${d1} = ${P1}/${d1} dan ${w2} ${b}/${d2} = ${P2}/${d2}. ` +
      (sameDen
        ? ''
        : `Samakan penyebut ke ${common}: ${P1}/${d1} = ${C1}/${common} dan ${P2}/${d2} = ${C2}/${common}. `) +
      `Maka ${C1}/${common} ${op} ${C2}/${common} = ${resultText(r, common)}.`,
  };
}

interface StoryTemplate {
  op: AddSub;
  unit: string;
  text: (a: string, b: string) => string;
}

const STORIES: StoryTemplate[] = [
  {
    op: '+',
    unit: 'liter',
    text: (a, b) =>
      `Rina menyiram bunga dengan ${a} liter air pada pagi hari dan ${b} liter air pada sore hari. Berapa liter air yang dipakai Rina?`,
  },
  {
    op: '+',
    unit: 'kg',
    text: (a, b) =>
      `Ibu membeli ${a} kg gula di warung. Kemudian Ibu membeli lagi ${b} kg gula. Berapa kg gula Ibu sekarang?`,
  },
  {
    op: '+',
    unit: 'meter',
    text: (a, b) =>
      `Dodi memiliki pita merah sepanjang ${a} meter dan pita biru sepanjang ${b} meter. Berapa meter panjang pita Dodi seluruhnya?`,
  },
  {
    op: '-',
    unit: 'kg',
    text: (a, b) =>
      `Paman memiliki ${a} kg beras. Sebanyak ${b} kg dimasak untuk acara keluarga. Berapa kg sisa beras Paman?`,
  },
  {
    op: '-',
    unit: 'liter',
    text: (a, b) =>
      `Sebuah ember berisi ${a} liter air. Sebanyak ${b} liter dipakai untuk mengepel lantai. Berapa liter air yang tersisa?`,
  },
  {
    op: '-',
    unit: 'meter',
    text: (a, b) =>
      `Kak Sinta mempunyai kain sepanjang ${a} meter. Kain itu dipotong ${b} meter untuk membuat taplak. Berapa meter sisa kainnya?`,
  },
];

function meta(category: QuestionCategory, difficulty: Difficulty) {
  return {
    damage: GAME_CONFIG.DAMAGE[difficulty],
    timeLimit:
      category === 'fraction_story' ? GAME_CONFIG.TIME_LIMIT.story : GAME_CONFIG.TIME_LIMIT.standard,
  };
}

/**
 * Four answer choices with distinct values: the answer plus common mistakes
 * (adding denominators, forgetting to flip) and near-miss values.
 */
export function buildOptions(
  eq: Pick<FracEquation, 'left' | 'op' | 'right'> & Partial<Pick<FracEquation, 'leftText' | 'rightText'>>,
  answer: Frac,
): string[] {
  const { op } = eq;
  // Mistakes are modelled on the numbers as written (2/4 stays 2/4), not the simplified value.
  const left = (eq.leftText && writtenFrac(eq.leftText)) || eq.left;
  const right = (eq.rightText && writtenFrac(eq.rightText)) || eq.right;
  const common = lcm(left.d, right.d);
  const mistakes: Frac[] = [];
  const nearMisses: Frac[] = [];
  const tryPush = (list: Frac[], n: number, d: number) => {
    if (Number.isInteger(n) && Number.isInteger(d) && n > 0 && d > 0) list.push(frac(n, d));
  };

  if (op === '+') {
    tryPush(mistakes, left.n + right.n, left.d + right.d);
    tryPush(mistakes, left.n * (common / left.d) + right.n, common);
  } else if (op === '-') {
    tryPush(mistakes, left.n - right.n, left.d - right.d);
    tryPush(mistakes, left.n * (common / left.d) - right.n, common);
  } else if (op === '×') {
    tryPush(mistakes, left.n * right.n, left.d + right.d);
    tryPush(mistakes, left.n * right.d, left.d * right.n);
  } else {
    tryPush(mistakes, left.n * right.n, left.d * right.d);
    tryPush(mistakes, answer.d, answer.n);
  }

  const stepDen = Math.max(common, answer.d);
  for (const k of [1, 2]) {
    nearMisses.push(addFrac(answer, frac(k, stepDen)));
    const lower = subFrac(answer, frac(k, stepDen));
    if (lower.n > 0) nearMisses.push(lower);
  }
  nearMisses.push(addFrac(answer, frac(1, 1)));
  const minusOne = subFrac(answer, frac(1, 1));
  if (minusOne.n > 0) nearMisses.push(minusOne);

  const chosen: Frac[] = [];
  const accept = (f: Frac) => {
    if (chosen.length >= 3) return;
    if (f.n <= 0 || fracEquals(f, answer)) return;
    if (chosen.some((c) => fracEquals(c, f))) return;
    chosen.push(f);
  };

  shuffle(mistakes).slice(0, 2).forEach(accept);
  shuffle(nearMisses).forEach(accept);
  for (let k = 3; chosen.length < 3; k += 1) {
    accept(addFrac(answer, frac(k, stepDen)));
  }

  return shuffle([answer, ...chosen].map(formatFrac));
}

function toQuestion(
  category: QuestionCategory,
  difficulty: Difficulty,
  built: BuiltProblem,
  story?: StoryTemplate,
): Question {
  const equationLine = `${built.leftText} ${built.op} ${built.rightText} = ?`;
  const eq = parseEquation(equationLine);
  if (!eq) throw new Error(`Soal tidak valid: ${equationLine}`);
  const answer = evaluateEquation(eq);
  const answerText = formatFrac(answer);

  return {
    id: Date.now() + randInt(1, 99999),
    level: LEVEL_OF[category],
    category,
    difficulty,
    question: story
      ? `${story.text(built.leftText, built.rightText)}\n${equationLine}`
      : equationLine,
    options: buildOptions(eq, answer),
    answer: answerText,
    explanation: story
      ? `${built.explanation} Jadi hasilnya ${answerText} ${story.unit}.`
      : built.explanation,
    ...meta(category, difficulty),
  };
}

export function generateLikeFractionQuestion(difficulty: Difficulty = 'easy'): Question {
  return toQuestion('fraction_like', difficulty, buildLike(difficulty));
}

export function generateUnlikeFractionQuestion(difficulty: Difficulty = 'normal'): Question {
  return toQuestion('fraction_unlike', difficulty, buildUnlike(difficulty));
}

export function generateMixedFractionQuestion(difficulty: Difficulty = 'normal'): Question {
  return toQuestion('fraction_mixed', difficulty, buildMixed(difficulty));
}

export function generateFractionStoryQuestion(difficulty: Difficulty = 'hard'): Question {
  const story = pick(STORIES);
  const builder =
    difficulty === 'easy' ? buildLike : difficulty === 'normal' ? buildUnlike : buildMixed;
  return toQuestion('fraction_story', difficulty, builder(difficulty, story.op), story);
}

const GENERATORS: Record<QuestionCategory, (d: Difficulty) => Question> = {
  fraction_like: generateLikeFractionQuestion,
  fraction_unlike: generateUnlikeFractionQuestion,
  fraction_mixed: generateMixedFractionQuestion,
  fraction_story: generateFractionStoryQuestion,
};

export function generateQuestionByCategory(
  category: QuestionCategory,
  difficulty: Difficulty,
): Question {
  const gen = GENERATORS[category] ?? generateLikeFractionQuestion;
  return gen(difficulty);
}

export function validateQuestion(q: Question): boolean {
  if (!q.question || !q.answer || !q.options || q.options.length !== 4) return false;
  if (!q.options.includes(q.answer)) return false;

  const values = q.options.map(parseFrac);
  if (values.some((v) => !v || v.n <= 0)) return false;
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (fracEquals(values[i] as Frac, values[j] as Frac)) return false;
    }
  }

  const eq = parseEquation(q.question);
  const answer = parseFrac(q.answer);
  if (eq && answer && !fracEquals(evaluateEquation(eq), answer)) return false;
  return true;
}
