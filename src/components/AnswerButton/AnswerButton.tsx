import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AudioManager } from '../../services/AudioManager';

import { FractionDisplay } from '../Fraction/FractionView';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export function AnswerButton({ label, onPress, disabled, selected }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Jawaban ${label}`}
      disabled={disabled}
      onPress={() => {
        void AudioManager.play('click');
        onPress();
      }}
      style={({ pressed }) => [
        styles.btn,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <FractionDisplay
        data={label}
        fontSize={20}
        color={selected ? colors.textInverse : colors.gold}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 46,
    flexBasis: '48%',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    ...shadows.soft,
  },
  text: {
    ...typography.bodyLarge,
    color: colors.gold,
    fontWeight: '800',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
