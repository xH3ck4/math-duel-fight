import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { CHARACTERS } from '../../data/characters';
import { AppButton } from '../../components/Button/AppButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { useGameStore } from '../../store/gameStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { AudioManager } from '../../services/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterSelection'>;

export function CharacterSelectionScreen({ navigation }: Props) {
  const mode = useGameStore((s) => s.mode);
  const p1 = useGameStore((s) => s.player1CharacterId);
  const p2 = useGameStore((s) => s.player2CharacterId);
  const setP1 = useGameStore((s) => s.setPlayer1Character);
  const setP2 = useGameStore((s) => s.setPlayer2Character);

  const [pickingFor, setPickingFor] = React.useState<'p1' | 'p2'>('p1');

  const selected = pickingFor === 'p1' ? p1 : p2;

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Pilih Karakter</Text>
          <Text style={styles.sub}>
            {mode === 'pvc'
              ? 'Pilih karaktermu. Komputer memilih otomatis.'
              : `Sedang memilih untuk ${pickingFor === 'p1' ? 'Player 1' : 'Player 2'}`}
          </Text>

          {mode === 'pvp' && (
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, pickingFor === 'p1' && styles.tabActive]}
                onPress={() => setPickingFor('p1')}
              >
                <Text style={[styles.tabText, pickingFor === 'p1' && styles.tabTextActive]}>P1: {p1}</Text>
              </Pressable>
              <Pressable
                style={[styles.tab, pickingFor === 'p2' && styles.tabActive]}
                onPress={() => setPickingFor('p2')}
              >
                <Text style={[styles.tabText, pickingFor === 'p2' && styles.tabTextActive]}>P2: {p2}</Text>
              </Pressable>
            </View>
          )}

          {CHARACTERS.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                void AudioManager.play('click');
                if (pickingFor === 'p1') setP1(c.id);
                else setP2(c.id);
              }}
              style={[
                styles.card,
                { borderColor: c.color },
                selected === c.id && styles.selected,
              ]}
            >
              <CharacterView characterId={c.id} size={88} showName={false} />
              <View style={styles.info}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={[styles.titleText, { color: c.color }]}>{c.title}</Text>
                <Text style={styles.desc}>{c.description}</Text>
                <Text style={styles.stats}>
                  HP {c.stats.hp} · ATK {c.stats.attack} · DEF {c.stats.defense} · SPD {c.stats.speed}
                </Text>
              </View>
            </Pressable>
          ))}

          <AppButton
            title="Lanjut Setup"
            onPress={() => {
              if (mode === 'pvc') {
                const others = CHARACTERS.filter((ch) => ch.id !== p1);
                const npc = others[Math.floor(Math.random() * others.length)] ?? CHARACTERS[1];
                setP2(npc.id);
              }
              navigation.navigate('PlayerSetup');
            }}
          />
          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxxl },
  title: { ...typography.title, color: colors.gold },
  sub: { ...typography.body, color: 'rgba(247,244,236,0.8)' },
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(247,244,236,0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.3)',
  },
  tabActive: { backgroundColor: colors.gold },
  tabText: { ...typography.body, fontWeight: '800', color: colors.textInverse, textTransform: 'capitalize' },
  tabTextActive: { color: colors.navy },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    ...shadows.soft,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#FFF6D6',
  },
  info: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.navy },
  titleText: { ...typography.caption, fontWeight: '700' },
  desc: { ...typography.caption, color: colors.textSecondary },
  stats: { ...typography.caption, color: colors.navy, fontWeight: '700', marginTop: 4 },
});
