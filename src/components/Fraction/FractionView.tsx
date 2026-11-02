import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, radius, typography } from '../../theme';
import { fractionToSpeech } from '../../utils/fraction';
import {
  parseFractionToken,
  parseVerticalProblem,
  type ParsedFraction,
} from '../../utils/fractionParser';

interface FractionProps {
  data: ParsedFraction | string;
  fontSize?: number;
  color?: string;
  lineColor?: string;
}

/**
 * Renders a single fraction:
 * Numerator over horizontal bar over denominator, with optional whole number.
 * Vertically centered, crisp font padding, and responsive.
 */
export function FractionDisplay({
  data,
  fontSize = 20,
  color = colors.textInverse,
  lineColor,
}: FractionProps) {
  const parsed = typeof data === 'string' ? parseFractionToken(data) : data;

  if (!parsed) {
    return (
      <Text style={[styles.plainText, { fontSize, color }]}>
        {typeof data === 'string' ? data : ''}
      </Text>
    );
  }

  const barColor = lineColor || color;
  const numDenSize = Math.max(13, Math.round(fontSize * 0.8));
  const numDenLineHeight = Math.round(numDenSize * 1.2);

  return (
    <View style={styles.fractionRow}>
      {parsed.whole ? (
        <Text
          style={[
            styles.wholeText,
            { fontSize, lineHeight: Math.round(fontSize * 1.2), color },
          ]}
        >
          {parsed.whole}
        </Text>
      ) : null}
      <View style={styles.stackedWrap}>
        <Text
          style={[
            styles.numText,
            { fontSize: numDenSize, lineHeight: numDenLineHeight, color },
          ]}
        >
          {parsed.num}
        </Text>
        <View style={[styles.fractionBar, { backgroundColor: barColor }]} />
        <Text
          style={[
            styles.denText,
            { fontSize: numDenSize, lineHeight: numDenLineHeight, color },
          ]}
        >
          {parsed.den}
        </Text>
      </View>
    </View>
  );
}

type TextSegment = { kind: 'text'; value: string } | { kind: 'fraction'; value: ParsedFraction };

const FRACTION_TOKEN = /(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)/g;

function tokenizeLine(line: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of line.matchAll(FRACTION_TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ kind: 'text', value: line.slice(last, start) });
    segments.push({
      kind: 'fraction',
      value: match[1]
        ? { whole: match[1], num: match[2], den: match[3] }
        : { num: match[4], den: match[5] },
    });
    last = start + match[0].length;
  }
  if (last < line.length) segments.push({ kind: 'text', value: line.slice(last) });
  return segments;
}

interface FractionTextProps {
  text: string;
  /** Text styling (font size, color, weight, line height). */
  style?: StyleProp<TextStyle>;
  /** Layout styling for the wrapping block (flex, margins). */
  containerStyle?: StyleProp<ViewStyle>;
  align?: 'left' | 'center';
  fractionColor?: string;
}

/**
 * Running text where every "a/b" or "w a/b" is drawn as a stacked fraction
 * (pembilang di atas garis, penyebut di bawah) instead of a slash.
 */
export function FractionText({
  text,
  style,
  containerStyle,
  align = 'left',
  fractionColor,
}: FractionTextProps) {
  const lines = useMemo(() => text.split('\n').map(tokenizeLine), [text]);
  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize = flat.fontSize ?? 14;
  const color = (flat.color as string | undefined) ?? colors.textInverse;

  return (
    <View
      style={[styles.textBlock, containerStyle]}
      accessible
      accessibilityLabel={fractionToSpeech(text)}
    >
      {lines.map((segments, lineIndex) => (
        <View key={lineIndex} style={[styles.textLine, align === 'center' && styles.textCentered]}>
          {segments.map((segment, segIndex) => {
            if (segment.kind === 'fraction') {
              return (
                <View key={segIndex} style={styles.inlineFraction}>
                  <FractionDisplay
                    data={segment.value}
                    fontSize={fontSize}
                    color={fractionColor ?? color}
                  />
                </View>
              );
            }
            // One Text per word so the row can wrap between words.
            const words = segment.value.match(/\S+\s*|\s+/g) ?? [];
            return words.map((word, wordIndex) => (
              <Text key={`${segIndex}-${wordIndex}`} style={style}>
                {word}
              </Text>
            ));
          })}
        </View>
      ))}
    </View>
  );
}

interface VerticalEquationProps {
  questionText: string;
  /**
   * For story problems, show only the narrative so the student has to work out
   * the operation themselves. Teaching material keeps the equation visible.
   */
  hideStoryEquation?: boolean;
}

/**
 * Standard, beautiful fraction equation display:
 * Renders:
 * 1. Story narrative text (if present)
 * 2. Mathematical equation row:
 *      Term 1    [op]    Term 2    =    [ ? ]
 * where each fraction is rendered with numerator over denominator.
 */
export function VerticalMathView({ questionText, hideStoryEquation = false }: VerticalEquationProps) {
  const parsed = parseVerticalProblem(questionText);

  if (hideStoryEquation && parsed?.storyText) {
    return (
      <View style={styles.container}>
        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Text style={styles.storyBadge}>📖 SOAL CERITA</Text>
          </View>
          <FractionText
            text={parsed.storyText}
            style={styles.storyTextLarge}
            fractionColor={colors.gold}
          />
        </View>
      </View>
    );
  }

  if (!parsed || !parsed.operator) {
    return (
      <View style={styles.fallbackWrap}>
        <FractionText text={questionText} style={styles.fallbackQuestion} align="center" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Story Narrative Box if present */}
      {parsed.storyText ? (
        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Text style={styles.storyBadge}>📖 SOAL CERITA</Text>
          </View>
          <FractionText text={parsed.storyText} style={styles.storyText} fractionColor={colors.gold} />
        </View>
      ) : null}

      {/* Standard Math Equation: Term 1 [op] Term 2 = [ ? ] */}
      <View style={styles.equationCard}>
        <View style={styles.equationRow}>
          {/* Term 1 */}
          <FractionDisplay
            data={parsed.topTerm}
            fontSize={22}
            color={colors.gold}
            lineColor={colors.gold}
          />

          {/* Operator Sign (+, -, ×, ÷) */}
          <View style={styles.opBox}>
            <Text style={styles.opSymbol}>{parsed.operator}</Text>
          </View>

          {/* Term 2 */}
          <FractionDisplay
            data={parsed.bottomTerm}
            fontSize={22}
            color={colors.gold}
            lineColor={colors.gold}
          />

          {/* Equal Sign (=) */}
          <View style={styles.opBox}>
            <Text style={styles.equalSymbol}>=</Text>
          </View>

          {/* Result Placeholder Box [ ? ] */}
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 3,
  },
  fallbackWrap: {
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackQuestion: {
    ...typography.question,
    fontSize: 18,
    color: colors.textInverse,
    textAlign: 'center',
  },
  storyCard: {
    width: '100%',
    backgroundColor: 'rgba(10, 28, 55, 0.92)',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.45)',
    gap: 3,
    marginBottom: 2,
  },
  storyHeader: {
    flexDirection: 'row',
  },
  storyBadge: {
    ...typography.hud,
    fontSize: 9,
    color: colors.gold,
    letterSpacing: 0.8,
  },
  storyText: {
    ...typography.body,
    fontSize: 12,
    color: colors.textInverse,
    lineHeight: 16,
  },
  storyTextLarge: {
    ...typography.body,
    fontSize: 15,
    color: colors.textInverse,
    lineHeight: 21,
  },
  equationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  opBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  opSymbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  equalSymbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  placeholderBox: {
    minWidth: 40,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.gold,
    includeFontPadding: false,
  },
  fractionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wholeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 6,
    includeFontPadding: false,
  },
  stackedWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    minWidth: 18,
  },
  fractionBar: {
    width: '100%',
    minWidth: 18,
    height: 2,
    marginVertical: 2,
    borderRadius: 1,
  },
  numText: {
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  denText: {
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  plainText: {
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  textBlock: {
    gap: 4,
  },
  textLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    rowGap: 2,
  },
  textCentered: {
    justifyContent: 'center',
  },
  inlineFraction: {
    marginHorizontal: 2,
  },
});
