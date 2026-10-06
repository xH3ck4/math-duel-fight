import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface Props {
  seconds: number;
  warning?: boolean;
}

export function Timer({ seconds, warning }: Props) {
  return (
    <View style={[styles.wrap, warning && styles.warning]}>
      <Text style={[styles.text, warning && styles.warningText]}>
        ⏱ {seconds}s
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
