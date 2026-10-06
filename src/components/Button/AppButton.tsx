import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AudioManager } from '../../services/AudioManager';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'warning';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: string;
}

const GRADIENT_PAIRS: Record<Variant, readonly [string, string]> = {
  primary: ['#FFD54F', '#E08900'],
  secondary: [colors.primaryLight, colors.primaryDark],
  success: [colors.accentLight, '#1A6B5E'],
  danger: ['#FF7A6E', colors.error],
  ghost: ['transparent', 'transparent'],
  warning: ['#FFE08A', '#E08900'],
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  textStyle,
  icon,
}: Props) {
  const handlePress = () => {
    void AudioManager.play('click');
    onPress();
  };

  const isPrimaryLike = variant === 'primary' || variant === 'warning';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={[...GRADIENT_PAIRS[variant]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, variant === 'ghost' && styles.ghost]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimaryLike ? colors.navy : colors.textInverse} />
        ) : (
          <Text
            style={[
              styles.text,
              isPrimaryLike && styles.textDark,
              variant === 'ghost' && styles.ghostText,
              textStyle,
            ]}
          >
            {icon ? `${icon}  ` : ''}
            {title}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 54,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.soft,
  },
  gradient: {
    minHeight: 54,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  text: {
    ...typography.button,
    color: colors.textInverse,
    textAlign: 'center',
  },
  textDark: {
    color: colors.navy,
  },
  ghost: {
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(15,42,82,0.55)',
  },
  ghostText: {
    color: colors.gold,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
