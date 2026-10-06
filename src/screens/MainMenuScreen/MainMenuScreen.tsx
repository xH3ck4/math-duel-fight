import React, { useEffect } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { CharacterView } from '../../components/Character/CharacterView';
import { AppButton } from '../../components/Button/AppButton';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { usePlayerStore } from '../../store/playerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { AudioManager } from '../../services/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const LOGO = require('../../../assets/logo-game.png');

function exitGame() {
  void AudioManager.play('click');
  void AudioManager.stopMusic();

  if (Platform.OS === 'android') {
    BackHandler.exitApp();
    return;
  }

  Alert.alert(
    'Keluar Game',
    'Tutup aplikasi dari switcher perangkat, atau tekan Home.',
    [{ text: 'OK' }],
  );
}

export function MainMenuScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const profile = usePlayerStore((s) => s.profile);
  const { musicEnabled, soundEnabled, setMusicEnabled, setSoundEnabled } = useSettingsStore();
  const floatY = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    pulse.value = withRepeat(
      withTiming(1.03, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    void AudioManager.playBgm('menu');
  }, [floatY, pulse]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const logoWidth = Math.min(width - 48, 340);

  const confirmExit = () => {
    Alert.alert('Keluar dari Math Duel?', 'Yakin ingin menutup game?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: exitGame },
    ]);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0B1C33', '#1A3F72', '#0F2A52']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(245,197,24,0.08)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.glow}
      />
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Image source={LOGO} style={styles.topLogo} resizeMode="contain" />
            <View style={styles.topActions}>
              <Pressable
                accessibilityLabel="Toggle music"
                onPress={() => {
                  void AudioManager.play('click');
                  void setMusicEnabled(!musicEnabled);
                }}
                style={styles.iconBtn}
              >
                <Text style={styles.iconText}>{musicEnabled ? 'BGM' : 'OFF'}</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Toggle sound"
                onPress={() => {
                  void AudioManager.play('click');
                  void setSoundEnabled(!soundEnabled);
                }}
                style={styles.iconBtn}
              >
                <Text style={styles.iconText}>{soundEnabled ? 'SFX' : 'OFF'}</Text>
              </Pressable>
            </View>
          </View>

          <Animated.View style={[styles.logoWrap, pulseStyle]}>
            <Image
              source={LOGO}
              style={{ width: logoWidth, height: logoWidth * 0.96 }}
              resizeMode="contain"
              accessibilityLabel="Math Duel logo"
            />
          </Animated.View>

          <Text style={styles.tagline}>Think Fast. Fight Smart!</Text>

          <Animated.View style={[styles.fighters, floatStyle]}>
            <CharacterView characterId="raka" facing="right" size={96} showName={false} />
            <View style={styles.vsBadge}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <CharacterView characterId="kai" facing="left" size={96} showName={false} />
          </Animated.View>

          <View style={styles.progressCard}>
            <Text style={styles.progressEyebrow}>PILOT STATUS</Text>
            <Text style={styles.progressTitle}>{profile.playerName}</Text>
            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.highestScore}</Text>
                <Text style={styles.statLabel}>BEST</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.totalWins}</Text>
                <Text style={styles.statLabel}>WINS</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.unlockedLevels.length}/8</Text>
                <Text style={styles.statLabel}>LEVEL</Text>
              </View>
            </View>
          </View>

          <View style={styles.menu}>
            <AppButton title="PLAY" onPress={() => navigation.navigate('ModeSelection')} />
            <AppButton
              title="HOW TO PLAY"
              variant="secondary"
              onPress={() => navigation.navigate('HowToPlay')}
            />
            <View style={styles.menuRow}>
              <View style={styles.half}>
                <AppButton title="PROFILE" variant="success" onPress={() => navigation.navigate('Profile')} />
              </View>
              <View style={styles.half}>
                <AppButton
                  title="TROPHY"
                  variant="warning"
                  onPress={() => navigation.navigate('Achievement')}
                />
              </View>
            </View>
            <View style={styles.menuRow}>
              <View style={styles.half}>
                <AppButton title="SETTINGS" variant="ghost" onPress={() => navigation.navigate('Settings')} />
              </View>
              <View style={styles.half}>
                <AppButton title="ABOUT" variant="ghost" onPress={() => navigation.navigate('About')} />
              </View>
            </View>
            <AppButton title="EXIT GAME" variant="danger" onPress={confirmExit} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  flex: { flex: 1 },
  glow: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    height: 220,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLogo: {
    width: 44,
    height: 44,
  },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    minWidth: 52,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(247,244,236,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  iconText: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 11,
  },
  logoWrap: {
    marginTop: spacing.sm,
    ...shadows.medium,
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  fighters: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  vsBadge: {
    backgroundColor: colors.error,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.gold,
    marginBottom: 18,
  },
  vsText: {
    color: colors.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  progressCard: {
    width: '100%',
    backgroundColor: colors.panelLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.soft,
  },
  progressEyebrow: {
    ...typography.hud,
    color: colors.primary,
  },
  progressTitle: {
    ...typography.heading,
    color: colors.navy,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.subheading,
    color: colors.gold,
  },
  statLabel: {
    ...typography.hud,
    color: colors.textInverse,
    opacity: 0.8,
    fontSize: 10,
  },
  menu: { width: '100%', gap: spacing.sm, marginTop: spacing.sm },
  menuRow: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});
