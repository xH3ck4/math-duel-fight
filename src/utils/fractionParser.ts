export interface ParsedFraction {
  whole?: string;
  num: string;
  den: string;
}

export interface ParsedVerticalProblem {
  storyText?: string;
  topTerm: ParsedFraction | string;
  operator: '+' | '-' | '×' | '÷' | ':' | string;
  bottomTerm: ParsedFraction | string;
  resultPlaceholder?: string;
}

/**
 * Checks if a string contains a fraction like "3/4" or "2 1/3".
 */
export function parseFractionToken(raw: string): ParsedFraction | null {
  const trimmed = raw.trim();
  // Check mixed fraction like "2 1/3" or "2_1/3"
  const mixedMatch = trimmed.match(/^(\d+)[\s_]+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    return {
      whole: mixedMatch[1],
      num: mixedMatch[2],
      den: mixedMatch[3],
    };
  }
  // Check simple fraction like "3/4"
  const simpleMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (simpleMatch) {
    return {
      num: simpleMatch[1],
      den: simpleMatch[2],
    };
  }
  return null;
}

/**
 * Parses questions into story (if any) and vertical arithmetic problem.
 * Examples:
 * "3/4 + 1/4 = ?"
 * "2 1/3 - 1 1/2 = ?"
 * "Pak Tani panen 3/4 ton padi lalu menjual 1/2 ton. Berapa sisa?\n3/4 - 1/2 = ?"
 */
export function parseVerticalProblem(questionText: string): ParsedVerticalProblem | null {
  const text = questionText.trim();

  // Check if there is a story and an equation separated by newline or question mark
  let story: string | undefined;
  let eqStr = text;

  if (text.includes('\n')) {
    const parts = text.split('\n');
    eqStr = parts[parts.length - 1].trim();
    story = parts.slice(0, parts.length - 1).join('\n').trim();
  }

  // Also check if [eq] is enclosed in bracket or ends with = ?
  const eqMatch = eqStr.match(
    /(\d+[\s_]+\d+\/\d+|\d+\/\d+|\d+)\s*([\+\-\×\*\:\÷\−])\s*(\d+[\s_]+\d+\/\d+|\d+\/\d+|\d+)(?:\s*=\s*\??)?/
  );

  if (eqMatch) {
    const rawTop = eqMatch[1].trim();
    let op = eqMatch[2].trim();
    if (op === '*' || op === 'x') op = '×';
    if (op === ':' || op === '/') op = '÷';
    if (op === '−') op = '-';
    const rawBottom = eqMatch[3].trim();

    const topTerm = parseFractionToken(rawTop) ?? rawTop;
    const bottomTerm = parseFractionToken(rawBottom) ?? rawBottom;

    // If story was not separated by newline, extract it if preceding the equation
    if (!story) {
      const idx = text.indexOf(eqMatch[0]);
      if (idx > 0) {
        story = text.substring(0, idx).trim();
      }
    }

    return {
      storyText: story,
      topTerm,
      operator: op,
      bottomTerm,
      resultPlaceholder: '?',
    };
  }

  // Fallback if not standard 2-term equation but has story
  if (story) {
    return {
      storyText: text,
      topTerm: '',
      operator: '',
      bottomTerm: '',
    };
  }

  return null;
}
