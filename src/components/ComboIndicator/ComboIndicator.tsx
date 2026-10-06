import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../../theme';

interface Props {
  combo: number;
}

export function ComboIndicator({ combo }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (combo >= 2) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 120 }),
        withTiming(1, { duration: 120 }),
      );
    }
  }, [combo, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (combo < 2) return null;

  return (
    <Animated.View style={[styles.wrap, style]}>
      <Text style={styles.text}>🔥 COMBO x{Math.min(combo, 4)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    backgroundColor: colors.warningBg,
    borderColor: colors.combo,
    borderWidth: 2,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.subheading,
    color: colors.combo,
    fontWeight: '900',
  },
});
