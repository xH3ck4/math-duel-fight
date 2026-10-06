import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface Props {
  name: string;
  score: number;
  align?: 'left' | 'right';
}

export function ScoreBoard({ name, score, align = 'left' }: Props) {
  return (
    <View style={[styles.wrap, align === 'right' && styles.right]}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.score}>Skor: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  right: {
    alignItems: 'flex-end',
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  score: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '800',
  },
});
