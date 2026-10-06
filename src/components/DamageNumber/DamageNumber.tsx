import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography } from '../../theme';

interface Props {
  value: number;
  visible: boolean;
  onDone?: () => void;
}

export function DamageNumber({ value, visible, onDone }: Props) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    y.value = 0;
    opacity.value = 1;
    y.value = withTiming(-40, { duration: 700 });
    opacity.value = withTiming(0, { duration: 700 }, (finished) => {
      if (finished && onDone) {
        runOnJS(onDone)();
      }
    });
  }, [visible, value, y, opacity, onDone]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, style]} pointerEvents="none">
      <Text style={styles.text}>-{value} HP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    zIndex: 20,
  },
  text: {
    ...typography.heading,
    color: colors.error,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
