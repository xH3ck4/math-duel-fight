import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { getMaterialByLevel, FRACTION_MATERIALS } from '../../data/materials';
import { getLevelById, LEVELS } from '../../data/levels';
import { AppButton } from '../../components/Button/AppButton';
import { FractionDisplay, VerticalMathView } from '../../components/Fraction/FractionView';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import { AudioManager } from '../../services/AudioManager';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Material'>;

export function MaterialScreen({ route, navigation }: Props) {
  const initialLevelId = route.params?.levelId ?? 1;
  const [selectedLevelId, setSelectedLevelId] = useState<number>(initialLevelId);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const markMaterialViewed = usePlayerStore((s) => s.markMaterialViewed);
  const setLevelId = useGameStore((s) => s.setLevelId);

  const material = getMaterialByLevel(selectedLevelId);
  const levelInfo = getLevelById(selectedLevelId);

  useEffect(() => {
    const onBackPress = () => {
      setShowExitConfirm(true);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  const handleLevelTabChange = (lvl: number) => {
    void AudioManager.play('click');
    setSelectedLevelId(lvl);
    setVideoError(false);
  };

  const handleReadyToFight = async () => {
    void AudioManager.play('click');
    await markMaterialViewed(selectedLevelId);
    setLevelId(selectedLevelId);
    navigation.navigate('PlayerSetup');
  };

  const openYoutubeExternal = () => {
    void AudioManager.play('click');
    void Linking.openURL(material.youtubeUrl).catch(() => {});
  };

  // Safe HTML embed with explicit origin to resolve YouTube Error 152 / 153
  const embedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="referrer" content="strict-origin-when-cross-origin">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; background-color: #0B1C33; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.youtube-nocookie.com/embed/${material.youtubeId}?playsinline=1&modestbranding=1&rel=0&enablejsapi=1"
          title="Video Pembelajaran Pecahan"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </body>
    </html>
  `;

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void AudioManager.play('click');
              setShowExitConfirm(true);
            }}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerEyebrow}>AKADEMI PECAHAN</Text>
            <Text style={styles.headerTitle}>Materi Pembelajaran</Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Level Quick Tabs */}
        <View style={styles.tabScrollWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {LEVELS.map((lvl) => {
              const isActive = lvl.id === selectedLevelId;
              return (
                <Pressable
                  key={lvl.id}
                  onPress={() => handleLevelTabChange(lvl.id)}
                  style={[styles.tabChip, isActive && styles.tabChipActive]}
                >
                  <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                    Lv {lvl.id}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Level Info Header Card */}
          <View style={styles.titleCard}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelIcon}>{levelInfo.icon}</Text>
              <Text style={styles.levelNumber}>LEVEL {material.levelId}</Text>
            </View>
            <Text style={styles.materialTitle}>{material.title}</Text>
            <Text style={styles.materialSubtitle}>{material.subtitle}</Text>
          </View>

          {/* YouTube Video Player with Offline Fallback */}
          <View style={styles.videoSection}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoSectionTitle}>🎬 VIDEO PEMBELAJARAN</Text>
              <Pressable onPress={openYoutubeExternal} style={styles.externalLinkBtn}>
                <Text style={styles.externalLinkText}>Buka YouTube ↗</Text>
              </Pressable>
            </View>

            <View style={styles.videoPlayerContainer}>
              {!videoError ? (
                <WebView
                  source={{
                    html: embedHtml,
                    baseUrl: 'https://www.youtube-nocookie.com',
                  }}
                  style={styles.webview}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                  userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                  onError={() => setVideoError(true)}
                  renderError={() => (
                    <View style={styles.fallbackBox}>
                      <Text style={styles.fallbackIcon}>📶</Text>
                      <Text style={styles.fallbackTitle}>Buka di Aplikasi YouTube</Text>
                      <Text style={styles.fallbackDesc}>
                        Jika pemutar video di aplikasi terkendala (Error 153/offline), kamu dapat
                        menonton langsung di aplikasi YouTube atau pelajari ringkasan di bawah.
                      </Text>
                      <Pressable onPress={openYoutubeExternal} style={styles.retryBtn}>
                        <Text style={styles.retryBtnText}>▶ Tonton di Aplikasi YouTube</Text>
                      </Pressable>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.fallbackBox}>
                  <Text style={styles.fallbackIcon}>📶</Text>
                  <Text style={styles.fallbackTitle}>Mode Belajar Offline</Text>
                  <Text style={styles.fallbackDesc}>
                    Koneksi internet terputus atau video ditolak. Rangkuman materi dan contoh hitung menurun tetap
                    tersedia lengkap di bawah ini.
                  </Text>
                  <Pressable onPress={openYoutubeExternal} style={styles.retryBtn}>
                    <Text style={styles.retryBtnText}>▶ Buka di Aplikasi YouTube</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* Konsep Dasar */}
          <View style={styles.card}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>💡 KONSEP DASAR</Text>
            </View>
            <Text style={styles.bodyText}>{material.conceptSummary}</Text>
          </View>

          {/* Aturan Emas */}
          <View style={styles.card}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>⭐ ATURAN PENTING</Text>
            </View>
            {material.rules.map((rule, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{rule}</Text>
              </View>
            ))}
          </View>

          {/* Metode Pengerjaan Pecahan */}
          <View style={styles.card}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>📐 CARA PENGERJAAN PECAHAN</Text>
            </View>
            <Text style={styles.bodyText}>{material.verticalMethodExplanation}</Text>
          </View>

          {/* Contoh Soal & Pembahasan Bersusun */}
          <View style={styles.card}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>📝 CONTOH SOAL & PEMBAHASAN</Text>
            </View>
            {material.examples.map((ex, idx) => (
              <View key={idx} style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>
                  Contoh {idx + 1}: {ex.title}
                </Text>
                <View style={styles.exampleProblemBox}>
                  <VerticalMathView questionText={ex.problem} />
                </View>
                <View style={styles.stepBox}>
                  <Text style={styles.stepHeader}>Langkah Pengerjaan:</Text>
                  {ex.steps.map((st, sIdx) => (
                    <Text key={sIdx} style={styles.stepText}>
                      {sIdx + 1}. {st}
                    </Text>
                  ))}
                </View>
                <View style={styles.answerBanner}>
                  <Text style={styles.answerLabel}>Jawaban Akhir:</Text>
                  <FractionDisplay data={ex.answer} fontSize={18} color={colors.gold} />
                </View>
              </View>
            ))}
          </View>

          {/* Tips Duel Petarung */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsBadge}>⚔️ TIPS CEPAT DUEL</Text>
            <Text style={styles.tipsText}>{material.battleTips}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <AppButton
              title="SAYA SUDAH PAHAM — MULAI BATTLE ⚔️"
              onPress={handleReadyToFight}
            />
            <AppButton
              title="Kembali ke Pilihan Level"
              variant="ghost"
              onPress={() => {
                void AudioManager.play('click');
                setShowExitConfirm(true);
              }}
            />
          </View>
        </ScrollView>

        {/* Modal Konfirmasi Keluar Materi */}
        <Modal
          visible={showExitConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowExitConfirm(false)}
        >
          <View style={styles.exitOverlay}>
            <View style={styles.exitCard}>
              <Text style={styles.exitIcon}>📖</Text>
              <Text style={styles.exitTitle}>Keluar dari Materi?</Text>
              <Text style={styles.exitDesc}>
                Kamu sedang mempelajari materi pecahan Level {selectedLevelId} ({material.title}).
                Apakah ingin tetap melanjutkan belajar atau keluar ke pilihan level?
              </Text>
              <View style={styles.exitActions}>
                <AppButton
                  title="Lanjutkan Belajar"
                  onPress={() => setShowExitConfirm(false)}
                />
                <AppButton
                  title="Ya, Keluar ke Level"
                  variant="danger"
                  onPress={() => {
                    setShowExitConfirm(false);
                    navigation.goBack();
                  }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.25)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(247, 244, 236, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.gold,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerEyebrow: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.textInverse,
    fontSize: 17,
  },
  headerRightPlaceholder: {
    width: 38,
  },
  tabScrollWrap: {
    backgroundColor: 'rgba(10, 28, 55, 0.85)',
    borderBottomWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.2)',
  },
  tabsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(247, 244, 236, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.2)',
  },
  tabChipActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  tabChipText: {
    ...typography.caption,
    color: 'rgba(247, 244, 236, 0.8)',
    fontWeight: '700',
  },
  tabChipTextActive: {
    color: colors.navy,
    fontWeight: '900',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  titleCard: {
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
    gap: 6,
    ...shadows.soft,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelIcon: {
    fontSize: 22,
  },
  levelNumber: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1,
  },
  materialTitle: {
    ...typography.title,
    color: colors.textInverse,
    fontSize: 22,
  },
  materialSubtitle: {
    ...typography.body,
    color: 'rgba(247, 244, 236, 0.85)',
    fontSize: 14,
  },
  videoSection: {
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    gap: spacing.sm,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoSectionTitle: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1,
  },
  externalLinkBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  externalLinkText: {
    ...typography.caption,
    color: colors.accentLight,
    fontWeight: '700',
    fontSize: 11,
  },
  videoPlayerContainer: {
    width: '100%',
    height: 210,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#081428',
  },
  webview: {
    flex: 1,
    backgroundColor: '#081428',
  },
  fallbackBox: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1C33',
    gap: 6,
  },
  fallbackIcon: {
    fontSize: 32,
  },
  fallbackTitle: {
    ...typography.subheading,
    color: colors.gold,
    fontSize: 15,
  },
  fallbackDesc: {
    ...typography.caption,
    color: 'rgba(247, 244, 236, 0.75)',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },
  retryBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  retryBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.panelDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
    gap: spacing.sm,
    ...shadows.soft,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.4)',
  },
  cardBadgeText: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 10,
  },
  bodyText: {
    ...typography.body,
    color: colors.textInverse,
    lineHeight: 22,
    fontSize: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletDot: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  bulletText: {
    ...typography.body,
    flex: 1,
    color: colors.textInverse,
    lineHeight: 20,
    fontSize: 14,
  },
  exampleBox: {
    backgroundColor: 'rgba(15, 42, 82, 0.7)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.25)',
    gap: 8,
  },
  exampleTitle: {
    ...typography.subheading,
    color: colors.gold,
    fontSize: 14,
  },
  exampleProblemBox: {
    backgroundColor: 'rgba(8, 20, 40, 0.5)',
    borderRadius: radius.sm,
    padding: 8,
    alignItems: 'center',
  },
  stepBox: {
    gap: 4,
  },
  stepHeader: {
    ...typography.caption,
    color: colors.accentLight,
    fontWeight: '700',
  },
  stepText: {
    ...typography.caption,
    color: colors.textInverse,
    lineHeight: 18,
    fontSize: 13,
  },
  answerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(43, 155, 138, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  answerLabel: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
  },
  tipsCard: {
    backgroundColor: 'rgba(230, 57, 43, 0.2)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
    gap: 6,
  },
  tipsBadge: {
    ...typography.hud,
    color: '#FFA197',
    fontSize: 11,
    letterSpacing: 1,
  },
  tipsText: {
    ...typography.body,
    color: colors.textInverse,
    lineHeight: 20,
    fontSize: 13,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  exitOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 14, 28, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  exitCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
    gap: spacing.sm,
  },
  exitIcon: {
    fontSize: 34,
    marginBottom: 4,
  },
  exitTitle: {
    ...typography.title,
    color: colors.gold,
    fontSize: 20,
    textAlign: 'center',
  },
  exitDesc: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  exitActions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
