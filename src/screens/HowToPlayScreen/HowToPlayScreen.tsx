import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HowToPlay'>;

const STEPS = [
  { icon: '👤', title: 'Pilih karakter', desc: 'Pilih pejuang matematika favoritmu.' },
  { icon: '📚', title: 'Pilih level', desc: 'Mulai dari penjumlahan hingga soal cerita.' },
  { icon: '🔄', title: 'Tunggu giliran', desc: 'Player 1 dan Player 2 bermain bergantian.' },
  { icon: '🧮', title: 'Baca soal', desc: 'Perhatikan soal dan hitung dengan teliti.' },
  { icon: '✅', title: 'Pilih jawaban', desc: 'Ketuk salah satu dari 4 pilihan.' },
  { icon: '💥', title: 'Jawaban benar', desc: 'Kamu menyerang lawan dan HP-nya berkurang.' },
  { icon: '💔', title: 'Jawaban salah', desc: 'Kamu terkena self-damage.' },
  { icon: '🏆', title: 'Menang', desc: 'Habiskan HP lawan untuk meraih kemenangan!' },
];

export function HowToPlayScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <LinearGradient colors={['#E8F4FC', '#FFF7ED']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>How To Play</Text>
          <View style={styles.card}>
            <Text style={styles.icon}>{current.icon}</Text>
            <Text style={styles.step}>Langkah {step + 1} / {STEPS.length}</Text>
            <Text style={styles.cardTitle}>{current.title}</Text>
            <Text style={styles.desc}>{current.desc}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.flexBtn}>
              <AppButton
                title="Sebelumnya"
                variant="ghost"
                disabled={step === 0}
                onPress={() => setStep((s) => Math.max(0, s - 1))}
              />
            </View>
            <View style={styles.flexBtn}>
              <AppButton
                title={step === STEPS.length - 1 ? 'Selesai' : 'Berikutnya'}
                onPress={() => {
                  if (step === STEPS.length - 1) navigation.goBack();
                  else setStep((s) => s + 1);
                }}
              />
            </View>
          </View>
          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, gap: spacing.lg },
  title: { ...typography.title, color: colors.primaryDark },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...shadows.soft,
  },
  icon: { fontSize: 72 },
  step: { ...typography.caption, color: colors.primary, fontWeight: '800' },
  cardTitle: { ...typography.heading, color: colors.text, textAlign: 'center' },
  desc: { ...typography.bodyLarge, color: colors.textSecondary, textAlign: 'center' },
  row: { flexDirection: 'row', gap: spacing.sm },
  flexBtn: { flex: 1 },
});
