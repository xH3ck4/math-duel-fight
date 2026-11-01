/**
 * Builds src/data/questions.ts for levels 1-4.
 * Hand-written seeds (scripts/fraction-question-seeds.json) are kept, their answers
 * are recomputed in simplest form and their options rebuilt; each level is then
 * topped up to QUESTIONS_PER_LEVEL with the app's own generator.
 *
 * Usage: npm run generate:questions
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'data', 'questions.ts');
const SEEDS = require('./fraction-question-seeds.json');
const QUESTIONS_PER_LEVEL = 25;
const DIFFICULTY_PLAN = { easy: 9, normal: 8, hard: 8 };

const moduleCache = new Map();
function loadTs(file) {
  if (moduleCache.has(file)) return moduleCache.get(file).exports;
  const source = fs.readFileSync(file, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const mod = { exports: {} };
  moduleCache.set(file, mod);
  const localRequire = (request) => {
    if (!request.startsWith('.')) return require(request);
    const base = path.resolve(path.dirname(file), request);
    for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (fs.existsSync(candidate)) return loadTs(candidate);
    }
    throw new Error(`Cannot resolve ${request} from ${file}`);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, mod, mod.exports);
  return mod.exports;
}

function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
Math.random = seededRandom(20261102);

const fraction = loadTs(path.join(ROOT, 'src', 'utils', 'fraction.ts'));
const generator = loadTs(path.join(ROOT, 'src', 'utils', 'questionGenerator.ts'));
const { GAME_CONFIG } = loadTs(path.join(ROOT, 'src', 'constants', 'gameConfig.ts'));

function metaFor(category, difficulty) {
  return {
    damage: GAME_CONFIG.DAMAGE[difficulty],
    timeLimit:
      category === 'fraction_story' ? GAME_CONFIG.TIME_LIMIT.story : GAME_CONFIG.TIME_LIMIT.standard,
  };
}

function normalizeSeed(seed) {
  const eq = fraction.parseEquation(seed.question);
  if (!eq) throw new Error(`Seed tanpa persamaan: ${seed.question}`);
  const value = fraction.evaluateEquation(eq);
  const stored = fraction.parseFrac(seed.answer);
  if (!stored || !fraction.fracEquals(stored, value)) {
    throw new Error(`Jawaban seed salah: ${seed.question} -> ${seed.answer}`);
  }
  const answer = fraction.formatFrac(value);
  let explanation = seed.explanation.trim();
  const mentionsSimplest = new RegExp(`(^|[^\\d/])${answer.replace(/[/]/g, '\\/')}([^\\d/]|$)`).test(
    explanation,
  );
  if (seed.answer !== answer && !mentionsSimplest) {
    explanation += ` Bentuk paling sederhana: ${seed.answer} = ${answer}.`;
  }
  return {
    level: seed.level,
    category: seed.category,
    difficulty: seed.difficulty,
    question: seed.question,
    options: generator.buildOptions(eq, value),
    answer,
    explanation,
    ...metaFor(seed.category, seed.difficulty),
  };
}

function equationKey(question) {
  const lines = question.trim().split('\n');
  return lines[lines.length - 1].replace(/\s+/g, ' ');
}

const byLevel = new Map();
for (const seed of SEEDS) {
  const q = normalizeSeed(seed);
  if (!byLevel.has(q.level)) byLevel.set(q.level, []);
  byLevel.get(q.level).push(q);
}

const CATEGORY_OF_LEVEL = { 1: 'fraction_like', 2: 'fraction_unlike', 3: 'fraction_mixed', 4: 'fraction_story' };

for (const [levelStr, category] of Object.entries(CATEGORY_OF_LEVEL)) {
  const level = Number(levelStr);
  const list = byLevel.get(level) ?? [];
  const seen = new Set(list.map((q) => equationKey(q.question)));
  for (const [difficulty, target] of Object.entries(DIFFICULTY_PLAN)) {
    let count = list.filter((q) => q.difficulty === difficulty).length;
    let guard = 0;
    while (count < target && guard < 500) {
      guard += 1;
      const q = generator.generateQuestionByCategory(category, difficulty);
      const key = equationKey(q.question);
      if (seen.has(key) || !generator.validateQuestion(q)) continue;
      seen.add(key);
      const { id, ...rest } = q;
      list.push(rest);
      count += 1;
    }
  }
  const order = { easy: 0, normal: 1, hard: 2 };
  list.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  byLevel.set(level, list.slice(0, QUESTIONS_PER_LEVEL));
}

const questions = [];
let nextId = 1;
for (const level of [1, 2, 3, 4]) {
  for (const q of byLevel.get(level)) {
    questions.push({ id: nextId++, ...q });
  }
}

const problems = questions.filter((q) => !generator.validateQuestion(q));
if (problems.length) {
  console.error('Soal tidak valid:', problems.map((q) => q.question));
  process.exit(1);
}

const summary = {};
for (const q of questions) {
  const key = `L${q.level}`;
  summary[key] = (summary[key] ?? 0) + 1;
}

const body = JSON.stringify(questions, null, 2);
fs.writeFileSync(
  OUT,
  `import type { Question } from '../types/game';

// Generated by scripts/generate-fraction-questions.js — edit the seeds or generator, then rerun.
export const QUESTIONS: Question[] = ${body};

export function getQuestionsByLevel(level: number): Question[] {
  return QUESTIONS.filter((q) => q.level === level);
}

export function getQuestionsByCategory(category: Question['category']): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}
`,
);
console.log(`Wrote ${questions.length} questions`, summary);
