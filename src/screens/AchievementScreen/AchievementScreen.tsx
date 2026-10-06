import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { ACHIEVEMENTS } from '../../data/achievements';
import { AppButton } from '../../components/Button/AppButton';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievement'>;

export function AchievementScreen({ navigation }: Props) {
  const unlocked = usePlayerStore((s) => s.profile.unlockedAchievements);

  return (
    <LinearGradient colors={['#E8F4FC', '#FFF7ED']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Achievement</Text>
          <Text style={styles.sub}>
            {unlocked.length} / {ACHIEVEMENTS.length} terbuka
          </Text>

          {ACHIEVEMENTS.map((ach) => {
            const isOn = unlocked.includes(ach.id);
            return (
              <View key={ach.id} style={[styles.card, !isOn && styles.locked]}>
                <Text style={styles.icon}>{isOn ? ach.icon : '🔒'}</Text>
                <View style={styles.info}>
                  <Text style={styles.name}>{ach.title}</Text>
                  <Text style={styles.desc}>{ach.description}</Text>
                  <Text style={styles.status}>{isOn ? 'Terbuka' : 'Terkunci'}</Text>
                </View>
              </View>
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
  title: { ...typography.title, color: colors.primaryDark },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.warning,
    ...shadows.soft,
  },
  locked: {
    opacity: 0.55,
    borderColor: colors.border,
  },
  icon: { fontSize: 36 },
  info: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.text },
  desc: { ...typography.caption, color: colors.textSecondary },
  status: { ...typography.caption, fontWeight: '800', color: colors.primary },
});
