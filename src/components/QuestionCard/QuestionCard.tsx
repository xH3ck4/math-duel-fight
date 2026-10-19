import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

import { VerticalMathView } from '../Fraction/FractionView';

interface Props {
  question: string;
  turnLabel: string;
}

export function QuestionCard({ question, turnLabel }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.turnBadge}>
        <Text style={styles.turn}>{turnLabel}</Text>
      </View>
      <VerticalMathView questionText={question} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.soft,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  turnBadge: {
    alignSelf: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 2,
  },
  turn: {
    ...typography.hud,
    color: colors.navy,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  question: {
    ...typography.question,
    color: colors.textInverse,
    textAlign: 'center',
  },
});
