import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NpcDifficulty, RootStackParamList } from '../../types/game';
import { CHARACTERS, getCharacterById } from '../../data/characters';
import { AppButton } from '../../components/Button/AppButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { useGameStore } from '../../store/gameStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { CHARACTER_COLORS } from '../../components/Character/FighterSprite';
import { AudioManager } from '../../services/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerSetup'>;

const NPC_LEVELS: NpcDifficulty[] = ['easy', 'normal', 'hard'];
const CHAR_IDS = CHARACTERS.map((c) => c.id);

export function PlayerSetupScreen({ navigation }: Props) {
  const mode = useGameStore((s) => s.mode);
  const npcDifficulty = useGameStore((s) => s.npcDifficulty);
  const setNpcDifficulty = useGameStore((s) => s.setNpcDifficulty);
  const setPlayerNames = useGameStore((s) => s.setPlayerNames);
  const startBattle = useGameStore((s) => s.startBattle);
  const p1Id = useGameStore((s) => s.player1CharacterId);
  const p2Id = useGameStore((s) => s.player2CharacterId);
  const setP1Char = useGameStore((s) => s.setPlayer1Character);
  const setP2Char = useGameStore((s) => s.setPlayer2Character);
  const p1Color = useGameStore((s) => s.player1Color);
  const p2Color = useGameStore((s) => s.player2Color);
  const setP1Color = useGameStore((s) => s.setPlayer1Color);
  const setP2Color = useGameStore((s) => s.setPlayer2Color);

  const [name1, setName1] = useState('Pemain 1');
  const [name2, setName2] = useState('Pemain 2');

  const c1 = getCharacterById(p1Id);
  const c2 = getCharacterById(p2Id);

  const cycleChar1 = (direction: 'next' | 'prev') => {
    void AudioManager.play('click');
    const currIdx = CHAR_IDS.indexOf(p1Id);
    const nextIdx =
      direction === 'next'
        ? (currIdx + 1) % CHAR_IDS.length
        : (currIdx - 1 + CHAR_IDS.length) % CHAR_IDS.length;
    setP1Char(CHAR_IDS[nextIdx]);
  };

  const cycleChar2 = (direction: 'next' | 'prev') => {
    void AudioManager.play('click');
    const currIdx = CHAR_IDS.indexOf(p2Id);
    const nextIdx =
      direction === 'next'
        ? (currIdx + 1) % CHAR_IDS.length
        : (currIdx - 1 + CHAR_IDS.length) % CHAR_IDS.length;
    setP2Char(CHAR_IDS[nextIdx]);
  };

  const onStart = () => {
    void AudioManager.play('click');
    setPlayerNames(name1 || 'Pemain 1', mode === 'pvc' ? 'Komputer' : name2 || 'Pemain 2');
    startBattle();
    navigation.navigate('Battle');
  };

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Kustomisasi Karakter & Pemain</Text>
          <Text style={styles.subtitle}>
            Sesuaikan avatar, nama, dan warna petarungmu sebelum memasuki arena duel!
          </Text>

          <View style={styles.row}>
            {/* Player 1 Card */}
            <View style={[styles.side, { borderColor: p1Color }]}>
              <Text style={styles.label}>PLAYER 1</Text>

              {/* Avatar Selector */}
              <View style={styles.charSelectRow}>
                <Pressable
                  onPress={() => cycleChar1('prev')}
                  style={styles.charArrowBtn}
                  hitSlop={8}
                >
                  <Text style={styles.charArrowText}>‹</Text>
                </Pressable>

                <CharacterView
                  characterId={c1.id}
                  customColor={p1Color}
                  customName={name1 || c1.name}
                  facing="right"
                  size={92}
                  showName={false}
                />

                <Pressable
                  onPress={() => cycleChar1('next')}
                  style={styles.charArrowBtn}
                  hitSlop={8}
                >
                  <Text style={styles.charArrowText}>›</Text>
                </Pressable>
              </View>

              <Text style={styles.charNameBadge}>{c1.name}</Text>

              <TextInput
                style={styles.input}
                value={name1}
                onChangeText={setName1}
                placeholder="Nama Karaktermu"
                placeholderTextColor="#8AA0BC"
                maxLength={16}
              />

              {/* Color Picker 1 */}
              <Text style={styles.colorLabel}>PILIH WARNA:</Text>
              <View style={styles.colorPalette}>
                {CHARACTER_COLORS.map((clr) => (
                  <Pressable
                    key={clr.id}
                    onPress={() => {
                      void AudioManager.play('click');
                      setP1Color(clr.hex);
                    }}
                    style={[
                      styles.colorDot,
                      { backgroundColor: clr.hex },
                      p1Color.toLowerCase() === clr.hex.toLowerCase() && styles.colorDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.vsBadge}>
              <Text style={styles.vs}>VS</Text>
            </View>

            {/* Player 2 Card */}
            <View style={[styles.side, { borderColor: p2Color }]}>
              <Text style={styles.label}>{mode === 'pvc' ? 'KOMPUTER' : 'PLAYER 2'}</Text>

              {mode === 'pvp' ? (
                <>
                  <View style={styles.charSelectRow}>
                    <Pressable
                      onPress={() => cycleChar2('prev')}
                      style={styles.charArrowBtn}
                      hitSlop={8}
                    >
                      <Text style={styles.charArrowText}>‹</Text>
                    </Pressable>

                    <CharacterView
                      characterId={c2.id}
                      customColor={p2Color}
                      customName={name2 || c2.name}
                      facing="left"
                      size={92}
                      showName={false}
                    />

                    <Pressable
                      onPress={() => cycleChar2('next')}
                      style={styles.charArrowBtn}
                      hitSlop={8}
                    >
                      <Text style={styles.charArrowText}>›</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.charNameBadge}>{c2.name}</Text>

                  <TextInput
                    style={styles.input}
                    value={name2}
                    onChangeText={setName2}
                    placeholder="Nama Karakter P2"
                    placeholderTextColor="#8AA0BC"
                    maxLength={16}
                  />

                  <Text style={styles.colorLabel}>PILIH WARNA:</Text>
                  <View style={styles.colorPalette}>
                    {CHARACTER_COLORS.map((clr) => (
                      <Pressable
                        key={clr.id}
                        onPress={() => {
                          void AudioManager.play('click');
                          setP2Color(clr.hex);
                        }}
                        style={[
                          styles.colorDot,
                          { backgroundColor: clr.hex },
                          p2Color.toLowerCase() === clr.hex.toLowerCase() && styles.colorDotActive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.charSelectRow}>
                    <CharacterView
                      characterId={c2.id}
                      customColor={p2Color}
                      customName="Komputer"
                      facing="left"
                      size={92}
                      showName={false}
                    />
                  </View>
                  <Text style={styles.charNameBadge}>{c2.name} (AI)</Text>
                  <Text style={styles.charName}>Lawan AI</Text>
                  <Text style={styles.npcNote}>Warna dan gerakan otomatis siap bertarung</Text>
                </>
              )}
            </View>
          </View>

          {mode === 'pvc' && (
            <View style={styles.diffBox}>
              <Text style={styles.diffTitle}>Tingkat Kesulitan Komputer</Text>
              <View style={styles.diffRow}>
                {NPC_LEVELS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => {
                      void AudioManager.play('click');
                      setNpcDifficulty(d);
                    }}
                    style={[styles.diffBtn, npcDifficulty === d && styles.diffActive]}
                  >
                    <Text style={[styles.diffText, npcDifficulty === d && styles.diffTextActive]}>
                      {d === 'easy' ? 'MUDAH' : d === 'normal' ? 'SEDANG' : 'SULIT'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actions}>
            <AppButton title="MULAI PERTARUNGAN ⚔️" onPress={onStart} />
            <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.title, color: colors.gold, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: 'rgba(247,244,236,0.85)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginTop: -8,
  },
  charSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  charArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 28, 51, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charArrowText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },
  charNameBadge: {
    ...typography.hud,
    color: colors.navy,
    fontSize: 10,
    backgroundColor: 'rgba(245, 197, 24, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  side: {
    flex: 1,
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  label: { ...typography.hud, color: colors.primary, fontSize: 11 },
  charName: { ...typography.subheading, color: colors.navy },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    textAlign: 'center',
    ...typography.body,
    color: colors.navy,
    backgroundColor: colors.surfaceMuted,
  },
  vsBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vs: { color: colors.textInverse, fontWeight: '900', fontSize: 13 },
  npcNote: { ...typography.caption, color: colors.textSecondary },
  diffBox: {
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.4)',
  },
  diffTitle: { ...typography.subheading, color: colors.gold, textAlign: 'center' },
  diffRow: { flexDirection: 'row', gap: spacing.sm },
  diffBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(247,244,236,0.08)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245,197,24,0.25)',
  },
  diffActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  diffText: { ...typography.caption, fontWeight: '800', color: colors.textInverse },
  diffTextActive: { color: colors.navy },
  colorLabel: {
    ...typography.hud,
    fontSize: 9,
    color: colors.primary,
    marginTop: 4,
    letterSpacing: 0.8,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.soft,
  },
  colorDotActive: {
    transform: [{ scale: 1.25 }],
    borderColor: colors.gold,
    borderWidth: 3,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
