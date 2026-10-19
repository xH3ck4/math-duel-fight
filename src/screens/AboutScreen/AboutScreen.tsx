import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export function AboutScreen({ navigation }: Props) {
  return (
    <LinearGradient colors={['#E8F4FC', '#FFF7ED']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Tentang Game</Text>
          <View style={styles.card}>
            <Text style={styles.logo}>⚔️ Fraction Battle</Text>
            <Text style={styles.tagline}>Kuasai Pecahan, Menangkan Pertarungan!</Text>
            <Text style={styles.body}>
              Fraction Battle adalah game edukasi pecahan interaktif untuk siswa kelas 5 SD.
              Dilengkapi materi pembelajaran lengkap, video edukasi YouTube, dan arena duel hitung
              menurun yang seru!
            </Text>
            <Text style={styles.body}>
              Jawab soal pecahan dengan cepat dan tepat untuk melancarkan serangan duel turn-based
              terhadap lawan atau komputer.
            </Text>
            <Text style={styles.meta}>Versi 1.0.0</Text>
            <Text style={styles.meta}>Materi Lengkap · Mode Offline & Online · React Native + Expo</Text>
          </View>
          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.lg },
  title: { ...typography.title, color: colors.primaryDark },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.soft,
  },
  logo: { ...typography.title, color: colors.primary, textAlign: 'center' },
  tagline: { ...typography.bodyLarge, color: colors.textSecondary, textAlign: 'center' },
  body: { ...typography.body, color: colors.text, lineHeight: 24 },
  meta: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
});
