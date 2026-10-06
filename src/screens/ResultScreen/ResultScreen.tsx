import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { useGameStore } from '../../store/gameStore';
import { AudioManager } from '../../services/AudioManager';
import { accuracyPercent, formatTime } from '../../utils/gameUtils';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation }: Props) {
  const result = useGameStore((s) => s.result);
  const startBattle = useGameStore((s) => s.startBattle);
  const resetBattle = useGameStore((s) => s.resetBattle);

  if (!result) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Tidak ada hasil pertandingan.</Text>
        <AppButton title="Menu" onPress={() => navigation.navigate('MainMenu')} />
      </View>
    );
  }

  const winnerName =
    result.winner === 'draw'
      ? 'SERI'
      : result.winner === 'player1'
        ? result.player1.name
        : result.player2.name;

  const winnerId =
    result.winner === 'player2'
      ? result.player2.characterId
      : result.player1.characterId;

  const isGameOver = result.winner === 'draw';

  const statBlock = (label: string, p: typeof result.player1) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{label}</Text>
      <Text style={styles.statLine}>Skor: {p.score}</Text>
      <Text style={styles.statLine}>Benar: {p.correctAnswers}</Text>
      <Text style={styles.statLine}>Salah: {p.wrongAnswers}</Text>
      <Text style={styles.statLine}>
        Akurasi: {accuracyPercent(p.correctAnswers, p.wrongAnswers)}%
      </Text>
      <Text style={styles.statLine}>Combo: x{p.highestCombo}</Text>
      <Text style={styles.statLine}>DMG Out: {p.damageDealt}</Text>
      <Text style={styles.statLine}>DMG In: {p.damageReceived}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.badge}>{isGameOver ? 'GAME OVER' : 'VICTORY'}</Text>
          <Text style={styles.title}>
            {isGameOver ? 'Hasil Seri' : `${winnerName} MENANG`}
          </Text>
          <CharacterView characterId={winnerId} size={140} showName />
          <Text style={styles.eval}>{result.evaluation}</Text>
          <Text style={styles.stars}>
            {'★'.repeat(Math.max(1, result.stars))}
            {'☆'.repeat(Math.max(0, 3 - result.stars))}
          </Text>
          <Text style={styles.time}>Waktu {formatTime(result.timePlayedSeconds)}</Text>

          <View style={styles.row}>
            {statBlock(result.player1.name, result.player1)}
            {statBlock(result.player2.name, result.player2)}
          </View>

          <AppButton
            title="PLAY AGAIN"
            onPress={() => {
              startBattle();
              navigation.replace('Battle');
            }}
          />
          <AppButton
            title="BACK TO MENU"
            variant="ghost"
            onPress={() => {
              resetBattle();
              void AudioManager.playBgm('menu');
              navigation.navigate('MainMenu');
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.navy,
  },
  fallbackText: { color: colors.textInverse },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  badge: {
    ...typography.hud,
    color: colors.gold,
    letterSpacing: 3,
  },
  title: {
    ...typography.title,
    color: colors.textInverse,
    textAlign: 'center',
  },
  eval: { ...typography.heading, color: colors.gold, textAlign: 'center' },
  stars: { fontSize: 28, color: colors.gold, letterSpacing: 4 },
  time: { ...typography.body, color: 'rgba(247,244,236,0.75)' },
  row: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  statCard: {
    flex: 1,
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    ...shadows.soft,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  statTitle: { ...typography.subheading, color: colors.navy, marginBottom: 4 },
  statLine: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
});
