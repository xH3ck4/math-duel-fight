import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NpcDifficulty, RootStackParamList } from '../../types/game';
import { getCharacterById } from '../../data/characters';
import { AppButton } from '../../components/Button/AppButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { useGameStore } from '../../store/gameStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerSetup'>;

const NPC_LEVELS: NpcDifficulty[] = ['easy', 'normal', 'hard'];

export function PlayerSetupScreen({ navigation }: Props) {
  const mode = useGameStore((s) => s.mode);
  const npcDifficulty = useGameStore((s) => s.npcDifficulty);
  const setNpcDifficulty = useGameStore((s) => s.setNpcDifficulty);
  const setPlayerNames = useGameStore((s) => s.setPlayerNames);
  const startBattle = useGameStore((s) => s.startBattle);
  const p1Id = useGameStore((s) => s.player1CharacterId);
  const p2Id = useGameStore((s) => s.player2CharacterId);

  const [name1, setName1] = useState('Player 1');
  const [name2, setName2] = useState('Player 2');

  const c1 = getCharacterById(p1Id);
  const c2 = getCharacterById(p2Id);

  const onStart = () => {
    setPlayerNames(name1 || 'Player 1', mode === 'pvc' ? 'Komputer' : name2 || 'Player 2');
    startBattle();
    navigation.navigate('Battle');
  };

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Setup Pertandingan</Text>

          <View style={styles.row}>
            <View style={styles.side}>
              <Text style={styles.label}>PLAYER</Text>
              <CharacterView characterId={c1.id} facing="right" size={100} showName={false} />
              <Text style={styles.charName}>{c1.name}</Text>
              <TextInput
                style={styles.input}
                value={name1}
                onChangeText={setName1}
                placeholder="Nama Player 1"
                placeholderTextColor="#8AA0BC"
                maxLength={16}
              />
            </View>

            <View style={styles.vsBadge}>
              <Text style={styles.vs}>VS</Text>
            </View>

            <View style={styles.side}>
              <Text style={styles.label}>{mode === 'pvc' ? 'COMPUTER' : 'PLAYER 2'}</Text>
              <CharacterView characterId={c2.id} facing="left" size={100} showName={false} />
              <Text style={styles.charName}>{c2.name}</Text>
              {mode === 'pvp' ? (
                <TextInput
                  style={styles.input}
                  value={name2}
                  onChangeText={setName2}
                  placeholder="Nama Player 2"
                  placeholderTextColor="#8AA0BC"
                  maxLength={16}
                />
              ) : (
                <Text style={styles.npcNote}>NPC otomatis</Text>
              )}
            </View>
          </View>

          {mode === 'pvc' && (
            <View style={styles.diffBox}>
              <Text style={styles.diffTitle}>Kesulitan NPC</Text>
              <View style={styles.diffRow}>
                {NPC_LEVELS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setNpcDifficulty(d)}
                    style={[styles.diffBtn, npcDifficulty === d && styles.diffActive]}
                  >
                    <Text style={[styles.diffText, npcDifficulty === d && styles.diffTextActive]}>
                      {d.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <AppButton title="START BATTLE" onPress={onStart} />
          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, gap: spacing.lg },
  title: { ...typography.title, color: colors.gold, textAlign: 'center' },
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
});
