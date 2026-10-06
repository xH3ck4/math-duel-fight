import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { getCharacterById } from '../../data/characters';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { FighterSprite, type FighterPose } from './FighterSprite';

interface Props {
  characterId: string;
  facing?: 'left' | 'right';
  isAttacking?: boolean;
  isHit?: boolean;
  isCritical?: boolean;
  isActive?: boolean;
  size?: number;
  showName?: boolean;
}

export function CharacterView({
  characterId,
  facing = 'right',
  isAttacking,
  isHit,
  isCritical,
  isActive,
  size = 118,
  showName = true,
}: Props) {
  const character = getCharacterById(characterId);
  const tx = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (isAttacking) {
      const dir = facing === 'right' ? 36 : -36;
      tx.value = withSequence(
        withTiming(dir, { duration: 160 }),
        withTiming(0, { duration: 220 }),
      );
      scale.value = withSequence(
        withTiming(1.08, { duration: 140 }),
        withTiming(1, { duration: 200 }),
      );
    }
  }, [isAttacking, facing, tx, scale]);

  useEffect(() => {
    if (isHit) {
      shake.value = withSequence(
        withTiming(10, { duration: 45 }),
        withTiming(-10, { duration: 45 }),
        withTiming(7, { duration: 45 }),
        withTiming(0, { duration: 45 }),
      );
      opacity.value = withSequence(
        withTiming(0.45, { duration: 70 }),
        withTiming(1, { duration: 120 }),
      );
    }
  }, [isHit, shake, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value + shake.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  let pose: FighterPose = 'idle';
  if (isAttacking) pose = 'attack';
  else if (isHit) pose = 'hit';

  return (
    <View style={[styles.wrap, isActive && styles.active]}>
      <Animated.View style={[styles.spriteWrap, animStyle]}>
        <FighterSprite
          characterId={characterId}
          size={size}
          facing={facing}
          pose={pose}
        />
        {isCritical ? (
          <View style={styles.criticalBadge}>
            <Text style={styles.criticalText}>CRITICAL</Text>
          </View>
        ) : null}
      </Animated.View>
      {showName ? (
        <View style={[styles.namePlate, { borderColor: character.color }]}>
          <Text style={styles.name}>{character.name}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  active: {
    transform: [{ scale: 1.04 }],
  },
  spriteWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  namePlate: {
    backgroundColor: colors.panelDark,
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    ...shadows.soft,
  },
  name: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  criticalBadge: {
    position: 'absolute',
    top: 4,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  criticalText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
