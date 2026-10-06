import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { LEVELS } from '../../data/levels';
import { AppButton } from '../../components/Button/AppButton';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AudioManager } from '../../services/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelection'>;

export function LevelSelectionScreen({ navigation }: Props) {
  const setLevelId = useGameStore((s) => s.setLevelId);
  const profile = usePlayerStore((s) => s.profile);

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Pilih Level</Text>
          <Text style={styles.sub}>Selesaikan level untuk membuka yang berikutnya</Text>

          {LEVELS.map((level) => {
            const unlocked = profile.unlockedLevels.includes(level.id);
            const best = profile.levelBestScores[String(level.id)] ?? 0;
            const stars = profile.levelStars[String(level.id)] ?? 0;
            return (
              <Pressable
                key={level.id}
                disabled={!unlocked}
                onPress={() => {
                  void AudioManager.play('click');
                  setLevelId(level.id);
                  navigation.navigate('CharacterSelection');
                }}
                style={[styles.card, !unlocked && styles.locked]}
              >
                <Text style={styles.icon}>{unlocked ? level.icon : '🔒'}</Text>
                <View style={styles.info}>
                  <Text style={styles.name}>
                    Level {level.id}: {level.name}
                  </Text>
                  <Text style={styles.desc}>{level.description}</Text>
                  <Text style={styles.meta}>
                    {level.difficulty.toUpperCase()} · {level.questionCount} soal
                  </Text>
                  <Text style={styles.meta}>
                    Best: {best} · {'⭐'.repeat(stars) || '☆☆☆'}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxxl },
  title: { ...typography.title, color: colors.gold },
  sub: { ...typography.body, color: 'rgba(247,244,236,0.75)', marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.soft,
  },
  locked: {
    opacity: 0.45,
    borderColor: colors.border,
  },
  icon: { fontSize: 36 },
  info: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.navy },
  desc: { ...typography.caption, color: colors.textSecondary },
  meta: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});
