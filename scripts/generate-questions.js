const fs = require('fs');
const path = 'src/data/questions.ts';

function meta(d) {
  const damage = d === 'easy' ? 10 : d === 'normal' ? 20 : 30;
  const timeLimit = d === 'easy' ? 15 : d === 'normal' ? 10 : 8;
  return { damage, timeLimit };
}

function opts(answer, distractors) {
  const set = new Set([String(answer)]);
  for (const d of distractors) set.add(String(d));
  let i = 1;
  while (set.size < 4) {
    set.add(String(Number(answer) + i));
    i += 1;
  }
  return [...set].slice(0, 4);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const questions = [];
let id = 1;

const adds = [
  [45, 28], [67, 34], [123, 456], [234, 178], [89, 76], [150, 250], [345, 278], [199, 301], [56, 78], [90, 45],
  [412, 388], [275, 125], [333, 222], [180, 220], [99, 101], [500, 275], [148, 252], [67, 89], [310, 190], [425, 175],
];
adds.forEach(([a, b], i) => {
  const ans = a + b;
  const d = i < 8 ? 'easy' : i < 15 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 1, category: 'addition', difficulty: d,
    question: `${a} + ${b} = ?`, options: shuffle(opts(ans, [ans + 10, ans - 10, ans + 1])),
    answer: String(ans), explanation: `${a} + ${b} = ${ans}`, ...meta(d),
  });
});

const subs = [
  [90, 35], [80, 27], [150, 75], [200, 88], [99, 45], [320, 145], [500, 275], [432, 189], [75, 28], [64, 19],
  [888, 444], [650, 275], [400, 156], [275, 98], [189, 67], [999, 456], [720, 315], [560, 280], [345, 167], [812, 456],
];
subs.forEach(([a, b], i) => {
  const ans = a - b;
  const d = i < 8 ? 'easy' : i < 15 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 2, category: 'subtraction', difficulty: d,
    question: `${a} − ${b} = ?`, options: shuffle(opts(ans, [ans + 10, Math.max(0, ans - 10), a + b])),
    answer: String(ans), explanation: `${a} − ${b} = ${ans}`, ...meta(d),
  });
});

const muls = [
  [6, 7], [8, 9], [7, 8], [9, 6], [12, 5], [11, 8], [9, 9], [12, 12], [15, 4], [14, 6], [13, 7], [16, 5], [25, 4], [18, 6], [12, 11],
];
muls.forEach(([a, b], i) => {
  const ans = a * b;
  const d = i < 5 ? 'easy' : i < 11 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 3, category: 'multiplication', difficulty: d,
    question: `${a} × ${b} = ?`, options: shuffle(opts(ans, [ans + a, ans - a, a * (b + 1)])),
    answer: String(ans), explanation: `${a} × ${b} = ${ans}`, ...meta(d),
  });
});

const divs = [
  [36, 6], [48, 8], [56, 7], [81, 9], [72, 8], [96, 12], [121, 11], [144, 12], [132, 11], [105, 7], [180, 12], [225, 15], [168, 14], [196, 14], [240, 16],
];
divs.forEach(([a, b], i) => {
  const ans = a / b;
  const d = i < 5 ? 'easy' : i < 11 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 4, category: 'division', difficulty: d,
    question: `${a} ÷ ${b} = ?`, options: shuffle(opts(ans, [ans + 1, ans - 1, b])),
    answer: String(ans), explanation: `${a} ÷ ${b} = ${ans}`, ...meta(d),
  });
});

const mixed = [
  [3, 4, 5], [5, 6, 10], [7, 8, 12], [4, 9, 15], [6, 7, 20], [8, 5, 25], [9, 3, 18], [10, 4, 30], [12, 3, 16], [5, 9, 11],
];
mixed.forEach(([a, b, c], i) => {
  const ans = a * b + c;
  const d = i < 4 ? 'easy' : i < 8 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 5, category: 'mixed', difficulty: d,
    question: `${a} × ${b} + ${c} = ?`,
    options: shuffle(opts(ans, [a * b - c > 0 ? a * b - c : ans + 5, a + b + c, ans + 10])),
    answer: String(ans), explanation: `${a} × ${b} = ${a * b}, lalu ${a * b} + ${c} = ${ans}`, ...meta(d),
  });
});

const fracs = [
  [1, 2, 1, 2, '1', '1/2 + 1/2 = 2/2 = 1', ['1/2', '2/3', '3/4']],
  [1, 4, 1, 4, '1/2', '1/4 + 1/4 = 2/4 = 1/2', ['1/4', '2/4', '1']],
  [1, 3, 1, 3, '2/3', '1/3 + 1/3 = 2/3', ['1/3', '1', '1/2']],
  [2, 5, 1, 5, '3/5', '2/5 + 1/5 = 3/5', ['2/5', '1/5', '4/5']],
  [3, 8, 1, 8, '1/2', '3/8 + 1/8 = 4/8 = 1/2', ['3/8', '4/8', '1']],
  [1, 6, 2, 6, '1/2', '1/6 + 2/6 = 3/6 = 1/2', ['1/6', '3/6', '2/3']],
  [3, 4, 1, 4, '1', '3/4 + 1/4 = 4/4 = 1', ['3/4', '1/2', '2/4']],
  [2, 6, 1, 6, '1/2', '2/6 + 1/6 = 3/6 = 1/2', ['2/6', '1/3', '1']],
  [1, 5, 2, 5, '3/5', '1/5 + 2/5 = 3/5', ['1/5', '2/5', '4/5']],
  [3, 10, 2, 10, '1/2', '3/10 + 2/10 = 5/10 = 1/2', ['3/10', '5/10', '1']],
];
fracs.forEach(([n1, d1, n2, d2, ans, exp, dist], i) => {
  const d = i < 4 ? 'easy' : i < 8 ? 'normal' : 'hard';
  const set = new Set([ans, ...dist]);
  questions.push({
    id: id++, level: 6, category: 'fraction', difficulty: d,
    question: `${n1}/${d1} + ${n2}/${d2} = ?`,
    options: shuffle([...set].slice(0, 4)),
    answer: ans, explanation: exp, ...meta(d),
  });
});

const decs = [
  ['1.5', '2.3', '3.8'],
  ['2.4', '1.6', '4.0'],
  ['3.75', '1.25', '5.00'],
  ['0.5', '0.7', '1.2'],
  ['4.6', '2.4', '7.0'],
];
decs.forEach(([a, b, ans], i) => {
  const d = i < 2 ? 'easy' : i < 4 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 7, category: 'decimal', difficulty: d,
    question: `${a} + ${b} = ?`,
    options: shuffle(opts(ans, [
      (Number(ans) + 0.1).toFixed(1),
      Math.max(0, Number(ans) - 0.1).toFixed(1),
      (Number(ans) + 1).toFixed(1),
    ])),
    answer: ans, explanation: `${a} + ${b} = ${ans}`, ...meta(d),
  });
});

const stories = [
  ['Sebuah toko punya 5 kotak pensil. Tiap kotak berisi 24 pensil. Berapa total pensil?', '120', '5 × 24 = 120', ['100', '125', '144']],
  ['Ani punya 85 kelereng. Ia memberi 28 kelereng ke Budi. Berapa sisa kelereng Ani?', '57', '85 − 28 = 57', ['113', '28', '67']],
  ['Rani membaca 12 halaman setiap hari selama 7 hari. Berapa total halaman yang dibaca?', '84', '12 × 7 = 84', ['19', '72', '96']],
  ['Di kebun ada 48 pohon. Diganti 6 pohon mati. Berapa pohon yang tersisa?', '42', '48 − 6 = 42', ['54', '36', '48']],
  ['Sebuah bus membawa 35 penumpang. Di halte naik 12 orang. Berapa penumpang sekarang?', '47', '35 + 12 = 47', ['23', '50', '35']],
];
stories.forEach(([q, ans, exp, dist], i) => {
  const d = i < 2 ? 'easy' : i < 4 ? 'normal' : 'hard';
  questions.push({
    id: id++, level: 8, category: 'story', difficulty: d,
    question: q, options: shuffle(opts(ans, dist)),
    answer: ans, explanation: exp, ...meta(d),
  });
});

const byCat = {};
questions.forEach((q) => {
  byCat[q.category] = (byCat[q.category] || 0) + 1;
});
console.log('Count:', questions.length, byCat);

const lines = questions.map((q) => {
  const options = JSON.stringify(q.options);
  return `  {
    id: ${q.id},
    level: ${q.level},
    category: '${q.category}',
    difficulty: '${q.difficulty}',
    question: ${JSON.stringify(q.question)},
    options: ${options},
    answer: ${JSON.stringify(q.answer)},
    explanation: ${JSON.stringify(q.explanation)},
    damage: ${q.damage},
    timeLimit: ${q.timeLimit},
  }`;
});

const content = `import type { Question } from '../types/game';

export const QUESTIONS: Question[] = [
${lines.join(',\n')}
];

export function getQuestionsByLevel(level: number): Question[] {
  return QUESTIONS.filter((q) => q.level === level);
}

export function getQuestionsByCategory(category: Question['category']): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(path, content);
console.log('Wrote', path);
