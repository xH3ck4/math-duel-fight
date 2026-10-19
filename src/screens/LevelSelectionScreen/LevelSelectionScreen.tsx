import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LevelInfo, RootStackParamList } from '../../types/game';
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
  const hasViewedMaterial = usePlayerStore((s) => s.hasViewedMaterial);

  const [promptLevel, setPromptLevel] = useState<LevelInfo | null>(null);

  const handleStartBattle = (level: LevelInfo) => {
    void AudioManager.play('click');
    const isMaterialRead = hasViewedMaterial(level.id);
    if (!isMaterialRead) {
      // Mandatory material check!
      setPromptLevel(level);
      return;
    }
    setLevelId(level.id);
    navigation.navigate('PlayerSetup');
  };

  const handleOpenMaterial = (levelId: number) => {
    void AudioManager.play('click');
    setPromptLevel(null);
    navigation.navigate('Material', { levelId, returnToBattle: true });
  };

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Pilihan Level Pecahan</Text>
          <Text style={styles.sub}>
            Semua level terbuka bebas! Siswa wajib mengakses materi pembelajaran sebelum mulai
            bertarung di arena.
          </Text>

          {/* Banner Wajib Materi */}
          <View style={styles.ruleBanner}>
            <Text style={styles.ruleIcon}>💡</Text>
            <View style={styles.ruleTextWrap}>
              <Text style={styles.ruleTitle}>Peraturan Akademi</Text>
              <Text style={styles.ruleDesc}>
                Pelajari materi & video pembelajaran di setiap level untuk membuka akses duel
                pertarungan matematika.
              </Text>
            </View>
          </View>

          {LEVELS.map((level) => {
            const isMaterialRead = hasViewedMaterial(level.id);
            const best = profile.levelBestScores[String(level.id)] ?? 0;
            const stars = profile.levelStars[String(level.id)] ?? 0;

            return (
              <View key={level.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.icon}>{level.icon}</Text>
                  <View style={styles.info}>
                    <View style={styles.levelBadgeRow}>
                      <Text style={styles.levelNumber}>LEVEL {level.id}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isMaterialRead ? styles.statusBadgeDone : styles.statusBadgePending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isMaterialRead
                              ? styles.statusBadgeTextDone
                              : styles.statusBadgeTextPending,
                          ]}
                        >
                          {isMaterialRead ? '✓ Materi Siap' : '📖 Belum Baca Materi'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.name}>{level.name}</Text>
                    <Text style={styles.desc}>{level.description}</Text>
                    <Text style={styles.meta}>
                      {level.difficulty === 'easy'
                        ? 'MUDAH (1 Menit)'
                        : level.difficulty === 'normal'
                          ? 'SEDANG (1 Menit)'
                          : 'SULIT (2 Menit)'}{' '}
                      · {level.questionCount} Soal
                    </Text>
                    <Text style={styles.scoreMeta}>
                      Skor Terbaik: {best} · {'⭐'.repeat(stars) || '☆☆☆'}
                    </Text>
                  </View>
                </View>

                {/* Card Action Buttons */}
                <View style={styles.cardButtonsRow}>
                  <Pressable
                    onPress={() => handleOpenMaterial(level.id)}
                    style={styles.materialBtn}
                  >
                    <Text style={styles.materialBtnText}>📖 Buka Materi & Video</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleStartBattle(level)}
                    style={[
                      styles.battleBtn,
                      !isMaterialRead && styles.battleBtnMuted,
                    ]}
                  >
                    <Text style={styles.battleBtnText}>⚔️ Bertarung</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

          <AppButton title="Kembali ke Beranda" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>

        {/* Modal Wajib Baca Materi Terlebih Dahulu */}
        <Modal
          visible={!!promptLevel}
          transparent
          animationType="fade"
          onRequestClose={() => setPromptLevel(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalIcon}>📖</Text>
              <Text style={styles.modalTitle}>Akses Materi Diperlukan!</Text>
              <Text style={styles.modalDesc}>
                Siswa wajib mempelajari materi dan video pembelajaran Level {promptLevel?.id} (
                {promptLevel?.name}) terlebih dahulu sebelum bertanding di arena.
              </Text>
              <View style={styles.modalActions}>
                <AppButton
                  title="BUKA MATERI SEKARANG 📚"
                  onPress={() => promptLevel && handleOpenMaterial(promptLevel.id)}
                />
                <AppButton
                  title="Nanti Dulu"
                  variant="ghost"
                  onPress={() => setPromptLevel(null)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxxl },
  title: { ...typography.title, color: colors.gold, fontSize: 24 },
  sub: { ...typography.body, color: 'rgba(247,244,236,0.85)', fontSize: 13, lineHeight: 18 },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(43, 155, 138, 0.25)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  ruleIcon: { fontSize: 24 },
  ruleTextWrap: { flex: 1, gap: 2 },
  ruleTitle: { ...typography.subheading, color: colors.gold, fontSize: 13 },
  ruleDesc: { ...typography.caption, color: colors.textInverse, fontSize: 11, lineHeight: 15 },
  card: {
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
    gap: 12,
    ...shadows.soft,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  icon: { fontSize: 36, marginTop: 4 },
  info: { flex: 1, gap: 4 },
  levelBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelNumber: {
    ...typography.hud,
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusBadgeDone: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  statusBadgePending: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeTextDone: {
    color: colors.success,
  },
  statusBadgeTextPending: {
    color: colors.secondaryDark,
  },
  name: { ...typography.subheading, color: colors.navy, fontSize: 16 },
  desc: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  meta: { ...typography.caption, color: colors.primary, fontWeight: '800', fontSize: 11 },
  scoreMeta: { ...typography.caption, color: colors.navy, fontSize: 11 },
  cardButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  materialBtn: {
    flex: 1.2,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  materialBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
    fontSize: 11,
  },
  battleBtn: {
    flex: 1,
    backgroundColor: colors.gold,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.secondaryDark,
  },
  battleBtnMuted: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  battleBtnText: {
    ...typography.caption,
    color: colors.navy,
    fontWeight: '900',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 20, 40, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.medium,
  },
  modalIcon: {
    fontSize: 48,
  },
  modalTitle: {
    ...typography.title,
    color: colors.gold,
    textAlign: 'center',
    fontSize: 20,
  },
  modalDesc: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  modalActions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: 6,
  },
});
