import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { useSettingsStore } from '../../store/settingsStore';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onToggle} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={[styles.switch, value && styles.switchOn]}>
        <Text style={styles.switchText}>{value ? 'ON' : 'OFF'}</Text>
      </View>
    </Pressable>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const {
    musicEnabled,
    soundEnabled,
    vibrationEnabled,
    language,
    setMusicEnabled,
    setSoundEnabled,
    setVibrationEnabled,
    setLanguage,
  } = useSettingsStore();
  const resetProgress = usePlayerStore((s) => s.resetProgress);
  const [busy, setBusy] = useState(false);

  const confirmReset = () => {
    Alert.alert(
      'Reset Progress',
      'Semua progress, skor, dan achievement akan dihapus. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setBusy(true);
            void resetProgress().finally(() => setBusy(false));
          },
        },
      ],
    );
  };

  return (
    <LinearGradient colors={['#E8F4FC', '#FFF7ED']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.card}>
            <ToggleRow
              label="Music"
              value={musicEnabled}
              onToggle={() => void setMusicEnabled(!musicEnabled)}
            />
            <ToggleRow
              label="Sound Effect"
              value={soundEnabled}
              onToggle={() => void setSoundEnabled(!soundEnabled)}
            />
            <ToggleRow
              label="Vibration"
              value={vibrationEnabled}
              onToggle={() => void setVibrationEnabled(!vibrationEnabled)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>Language</Text>
            <Pressable
              style={[styles.langBtn, language === 'id' && styles.langActive]}
              onPress={() => void setLanguage('id')}
            >
              <Text style={styles.langText}>Bahasa Indonesia</Text>
            </Pressable>
            <Pressable style={[styles.langBtn, styles.langDisabled]} disabled>
              <Text style={styles.langText}>English (segera)</Text>
            </Pressable>
          </View>

          <AppButton
            title="Reset Progress"
            variant="danger"
            loading={busy}
            onPress={confirmReset}
          />
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
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.soft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  rowLabel: { ...typography.bodyLarge, color: colors.text, fontWeight: '700' },
  switch: {
    minWidth: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  switchOn: { backgroundColor: colors.accent },
  switchText: { ...typography.caption, fontWeight: '900', color: colors.textInverse },
  section: { ...typography.subheading, color: colors.text },
  langBtn: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  langActive: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
  },
  langDisabled: { opacity: 0.5 },
  langText: { ...typography.body, fontWeight: '700', color: colors.text },
});
