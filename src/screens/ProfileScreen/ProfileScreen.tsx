import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const profile = usePlayerStore((s) => s.profile);
  const setPlayerName = usePlayerStore((s) => s.setPlayerName);
  const getAccuracy = usePlayerStore((s) => s.getAccuracy);
  const [name, setName] = useState(profile.playerName);

  return (
    <LinearGradient colors={['#E8F4FC', '#FFF7ED']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.card}>
            <Text style={styles.avatar}>🧑‍🎓</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              maxLength={20}
              placeholder="Nama pemain"
            />
            <AppButton
              title="Simpan Nama"
              onPress={() => void setPlayerName(name)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.row}>Total game: {profile.totalGames}</Text>
            <Text style={styles.row}>Menang: {profile.totalWins}</Text>
            <Text style={styles.row}>Kalah: {profile.totalLosses}</Text>
            <Text style={styles.row}>Skor tertinggi: {profile.highestScore}</Text>
            <Text style={styles.row}>Combo tertinggi: x{profile.highestCombo}</Text>
            <Text style={styles.row}>Akurasi: {getAccuracy()}%</Text>
            <Text style={styles.row}>
              Level terbuka: {profile.unlockedLevels.join(', ')}
            </Text>
            <Text style={styles.row}>
              Achievement: {profile.unlockedAchievements.length}
            </Text>
          </View>

          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.title, color: colors.primaryDark },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.soft,
  },
  avatar: { fontSize: 56, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  row: { ...typography.body, color: colors.text, fontWeight: '600' },
});
