import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

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
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.soft,
    gap: spacing.sm,
  },
  turnBadge: {
    alignSelf: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  turn: {
    ...typography.hud,
    color: colors.navy,
    fontSize: 11,
  },
  question: {
    ...typography.question,
    color: colors.textInverse,
    textAlign: 'center',
  },
});
