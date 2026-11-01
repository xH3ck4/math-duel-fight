export interface Frac {
  n: number;
  d: number;
}

export type FracOperator = '+' | '-' | '×' | '÷';

export interface FracEquation {
  left: Frac;
  op: FracOperator;
  right: Frac;
  leftText: string;
  rightText: string;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b);
}

export function frac(n: number, d: number): Frac {
  if (d === 0) throw new Error('Penyebut tidak boleh 0');
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: (sign * d) / g };
}

export const addFrac = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const subFrac = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
export const mulFrac = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
export const divFrac = (a: Frac, b: Frac) => frac(a.n * b.d, a.d * b.n);

export function fracEquals(a: Frac, b: Frac): boolean {
  return a.n * b.d === b.n * a.d;
}

/** Simplest written form: whole "2", proper "3/4", improper as mixed "1 1/2". */
export function formatFrac(f: Frac): string {
  const s = frac(f.n, f.d);
  if (s.d === 1) return String(s.n);
  const whole = Math.trunc(s.n / s.d);
  const rest = Math.abs(s.n % s.d);
  if (whole === 0) return `${s.n}/${s.d}`;
  return `${whole} ${rest}/${s.d}`;
}

/** Keeps the given numerator/denominator, e.g. 6/8 stays "6/8". */
export function formatRaw(n: number, d: number): string {
  return `${n}/${d}`;
}

export function formatMixed(whole: number, n: number, d: number): string {
  return `${whole} ${n}/${d}`;
}

export function parseFrac(text: string): Frac | null {
  const t = text.trim();
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const d = Number(mixed[3]);
    if (!d) return null;
    return frac(Number(mixed[1]) * d + Number(mixed[2]), d);
  }
  const simple = t.match(/^(\d+)\/(\d+)$/);
  if (simple) {
    const d = Number(simple[2]);
    if (!d) return null;
    return frac(Number(simple[1]), d);
  }
  if (/^\d+$/.test(t)) return frac(Number(t), 1);
  return null;
}

const TERM = String.raw`\d+\s+\d+\/\d+|\d+\/\d+|\d+`;
const EQUATION = new RegExp(`(${TERM})\\s*([+\\-−×÷:])\\s*(${TERM})\\s*=\\s*\\?`);

/** Reads the "a op b = ?" equation from the last line of a question. */
export function parseEquation(question: string): FracEquation | null {
  const lines = question.trim().split('\n');
  const match = lines[lines.length - 1].match(EQUATION);
  if (!match) return null;
  const left = parseFrac(match[1]);
  const right = parseFrac(match[3]);
  if (!left || !right) return null;
  const rawOp = match[2];
  const op: FracOperator =
    rawOp === '−' ? '-' : rawOp === ':' ? '÷' : (rawOp as FracOperator);
  return { left, op, right, leftText: match[1].trim(), rightText: match[3].trim() };
}

export function evaluateEquation(eq: Pick<FracEquation, 'left' | 'op' | 'right'>): Frac {
  switch (eq.op) {
    case '+':
      return addFrac(eq.left, eq.right);
    case '-':
      return subFrac(eq.left, eq.right);
    case '×':
      return mulFrac(eq.left, eq.right);
    default:
      return divFrac(eq.left, eq.right);
  }
}

/** Screen-reader friendly text: "3/4" becomes "3 per 4". */
export function fractionToSpeech(text: string): string {
  return text.replace(/(\d+)\/(\d+)/g, '$1 per $2');
}
