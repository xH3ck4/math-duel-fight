import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, typography } from '../../theme';
import { getHpColor } from '../../utils/gameUtils';

interface Props {
  current: number;
  max: number;
  label?: string;
  showText?: boolean;
  light?: boolean;
}

export function HealthBar({ current, max, label, showText = true, light = true }: Props) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const width = useSharedValue(ratio);
  const tone = getHpColor(ratio);

  useEffect(() => {
    width.value = withTiming(ratio, { duration: 400 });
  }, [ratio, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const fillColor =
    tone === 'high' ? colors.hpHigh : tone === 'mid' ? colors.hpMid : colors.hpLow;

  return (
    <View style={styles.wrap}>
      {(label || showText) && (
        <View style={styles.row}>
          {label ? (
            <Text style={[styles.label, light && styles.lightText]}>{label}</Text>
          ) : (
            <View />
          )}
          {showText ? (
            <Text
              style={[
                styles.hpText,
                light && styles.lightText,
                tone === 'low' && styles.critical,
              ]}
            >
              HP {Math.ceil(current)}/{max}
            </Text>
          ) : null}
        </View>
      )}
      <View style={[styles.track, tone === 'low' && styles.trackCritical]}>
        <Animated.View style={[styles.fill, { backgroundColor: fillColor }, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  hpText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
    fontSize: 11,
  },
  lightText: {
    color: colors.textInverse,
  },
  critical: {
    color: '#FFB4AE',
  },
  track: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.35)',
  },
  trackCritical: {
    borderColor: colors.error,
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
