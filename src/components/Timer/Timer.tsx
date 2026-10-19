import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface Props {
  seconds: number;
  warning?: boolean;
}

export function Timer({ seconds, warning }: Props) {
  const isWarn = warning ?? seconds <= 15;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted =
    mins > 0
      ? `${mins}:${secs < 10 ? '0' : ''}${secs}`
      : `${secs}s`;

  return (
    <View style={[styles.wrap, isWarn && styles.warning]}>
      <Text style={[styles.text, isWarn && styles.warningText]}>
        ⏱ {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
  },
  text: {
    ...typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  warningText: {
    color: colors.secondaryDark,
  },
});
