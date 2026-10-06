import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AppButton } from '../../components/Button/AppButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { useGameStore } from '../../store/gameStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelection'>;

export function ModeSelectionScreen({ navigation }: Props) {
  const setMode = useGameStore((s) => s.setMode);

  return (
    <LinearGradient colors={['#0B1C33', '#1A3F72', '#0F2A52']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Pilih Mode</Text>
          <Text style={styles.sub}>Duel matematika offline di satu perangkat</Text>

          <View style={styles.card}>
            <View style={styles.preview}>
              <CharacterView characterId="kai" size={72} showName={false} />
              <Text style={styles.vs}>VS</Text>
              <CharacterView characterId="raka" facing="left" size={72} showName={false} />
            </View>
            <Text style={styles.cardTitle}>PLAYER VS PLAYER</Text>
            <Text style={styles.cardDesc}>
              Dua siswa bergantian menjawab soal pada satu perangkat.
            </Text>
            <AppButton
              title="Pilih PvP"
              onPress={() => {
                setMode('pvp');
                navigation.navigate('LevelSelection');
              }}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.preview}>
              <CharacterView characterId="naya" size={72} showName={false} />
              <Text style={styles.vs}>VS</Text>
              <CharacterView characterId="zara" facing="left" size={72} showName={false} />
            </View>
            <Text style={styles.cardTitle}>PLAYER VS COMPUTER</Text>
            <Text style={styles.cardDesc}>
              Latihan solo melawan NPC dengan tingkat kesulitan Easy / Normal / Hard.
            </Text>
            <AppButton
              title="Pilih PvC"
              variant="secondary"
              onPress={() => {
                setMode('pvc');
                navigation.navigate('LevelSelection');
              }}
            />
          </View>

          <AppButton title="Kembali" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: { ...typography.title, color: colors.gold },
  sub: { ...typography.body, color: 'rgba(247,244,236,0.75)', marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.panelLight,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.soft,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  vs: { ...typography.heading, color: colors.error, fontWeight: '900' },
  cardTitle: { ...typography.heading, color: colors.navy, textAlign: 'center' },
  cardDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
