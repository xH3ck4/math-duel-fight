import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { AnswerButton } from '../../components/AnswerButton/AnswerButton';
import { CharacterView } from '../../components/Character/CharacterView';
import { ComboIndicator } from '../../components/ComboIndicator/ComboIndicator';
import { DamageNumber } from '../../components/DamageNumber/DamageNumber';
import { FeedbackModal } from '../../components/FeedbackModal/FeedbackModal';
import { HealthBar } from '../../components/HealthBar/HealthBar';
import { QuestionCard } from '../../components/QuestionCard/QuestionCard';
import { Timer } from '../../components/Timer/Timer';
import { AppButton } from '../../components/Button/AppButton';
import { GAME_CONFIG } from '../../constants/gameConfig';
import { AudioManager } from '../../services/AudioManager';
import { decideNpcAnswer, useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Battle'>;

export function BattleScreen({ navigation }: Props) {
  const {
    player1,
    player2,
    currentTurn,
    currentQuestion,
    questionIndex,
    questions,
    timeRemaining,
    gamePhase,
    feedback,
    battleLog,
    lastDamage,
    mode,
    npcDifficulty,
    tickTimer,
    submitAnswer,
    clearFeedbackAndContinue,
    pauseGame,
    resumeGame,
    result,
  } = useGameStore();

  const applyBattleResult = usePlayerStore((s) => s.applyBattleResult);
  const [showDamage, setShowDamage] = useState(false);
  const [attacking, setAttacking] = useState(false);
  const [hitSide, setHitSide] = useState<'player1' | 'player2' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const npcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    void AudioManager.playBgm('fight');
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (npcTimerRef.current) clearTimeout(npcTimerRef.current);
      void AudioManager.playBgm('menu');
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (gamePhase !== 'question') return;

    timerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      tickTimer();
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gamePhase, questionIndex, currentTurn, tickTimer]);

  useEffect(() => {
    if (gamePhase !== 'question' || !currentQuestion) return;
    const active = currentTurn === 'player1' ? player1 : player2;
    if (!active?.isNpc) return;

    const { delay, answer } = decideNpcAnswer(currentQuestion, npcDifficulty);
    if (npcTimerRef.current) clearTimeout(npcTimerRef.current);
    npcTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      if (useGameStore.getState().gamePhase === 'question') {
        submitAnswer(answer);
      }
    }, delay);

    return () => {
      if (npcTimerRef.current) clearTimeout(npcTimerRef.current);
    };
  }, [gamePhase, currentQuestion, currentTurn, player1, player2, npcDifficulty, submitAnswer]);

  useEffect(() => {
    if (gamePhase !== 'feedback' || !feedback) return;

    void AudioManager.play(feedback.isCorrect ? 'correct' : 'wrong');
    if (feedback.isCorrect) {
      setAttacking(true);
      void AudioManager.play('attack');
    }
    setHitSide(lastDamage?.target ?? null);
    setShowDamage(true);
    if (!feedback.isCorrect) void AudioManager.play('hit');

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setAttacking(false);
      setHitSide(null);
      setShowDamage(false);
      clearFeedbackAndContinue();
    }, GAME_CONFIG.FEEDBACK_DURATION_MS);

    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [gamePhase, feedback, lastDamage, clearFeedbackAndContinue]);

  useEffect(() => {
    if (gamePhase !== 'victory' && gamePhase !== 'game-over') return;
    if (!result) return;

    void (async () => {
      void AudioManager.play(result.winner === 'player1' ? 'victory' : 'defeat');
      await applyBattleResult(result, 'player1');
      if (!mountedRef.current) return;
      navigation.replace('Result');
    })();
  }, [gamePhase, result, applyBattleResult, navigation]);

  if (!player1 || !player2 || !currentQuestion) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Memuat battle...</Text>
        <AppButton title="Kembali" onPress={() => navigation.navigate('MainMenu')} />
      </View>
    );
  }

  const turnLabel =
    currentTurn === 'player1'
      ? `P1 TURN — ${player1.name.toUpperCase()}`
      : `P2 TURN — ${player2.name.toUpperCase()}`;
  const activeIsHuman =
    currentTurn === 'player1' ? !player1.isNpc : !player2.isNpc;
  const combo = currentTurn === 'player1' ? player1.combo : player2.combo;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.arenaTop, colors.arenaMid, colors.arenaBottom]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(245,197,24,0.12)', 'transparent', 'rgba(230,57,43,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.flex}>
        {/* Fighting HUD */}
        <View style={styles.hud}>
          <View style={styles.hudSide}>
            <Text style={styles.hudName} numberOfLines={1}>
              {player1.name.toUpperCase()}
            </Text>
            <HealthBar current={player1.hp} max={player1.maxHp} showText />
            <Text style={styles.hudScore}>SCORE {player1.score}</Text>
          </View>

          <View style={styles.hudCenter}>
            <Text style={styles.vsText}>VS</Text>
            <Pressable style={styles.pauseBtn} onPress={pauseGame} accessibilityLabel="Pause">
              <Text style={styles.pauseText}>II</Text>
            </Pressable>
          </View>

          <View style={[styles.hudSide, styles.hudRight]}>
            <Text style={[styles.hudName, styles.alignRight]} numberOfLines={1}>
              {player2.name.toUpperCase()}
            </Text>
            <HealthBar current={player2.hp} max={player2.maxHp} showText />
            <Text style={[styles.hudScore, styles.alignRight]}>SCORE {player2.score}</Text>
          </View>
        </View>

        {/* Arena stage */}
        <View style={styles.arena}>
          <View style={styles.spotLight} />
          <View style={styles.stageFloor} />
          <View style={styles.stageEdge} />
          <View style={styles.fighters}>
            <CharacterView
              characterId={player1.characterId}
              facing="right"
              size={124}
              isAttacking={attacking && currentTurn === 'player1' && !!feedback?.isCorrect}
              isHit={hitSide === 'player1'}
              isCritical={player1.hp / player1.maxHp <= 0.25}
              isActive={currentTurn === 'player1'}
            />
            <CharacterView
              characterId={player2.characterId}
              facing="left"
              size={124}
              isAttacking={attacking && currentTurn === 'player2' && !!feedback?.isCorrect}
              isHit={hitSide === 'player2'}
              isCritical={player2.hp / player2.maxHp <= 0.25}
              isActive={currentTurn === 'player2'}
            />
          </View>
          <DamageNumber
            value={lastDamage?.amount ?? 0}
            visible={showDamage && !!lastDamage}
          />
          <ComboIndicator combo={combo} />
        </View>

        {/* Question console */}
        <View style={styles.console}>
          <LinearGradient
            colors={['rgba(247,244,236,0.98)', '#E8EEF6']}
            style={styles.consoleInner}
          >
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                Q {questionIndex + 1}/{questions.length}
              </Text>
              <Timer seconds={timeRemaining} warning={timeRemaining <= 3} />
              {mode === 'pvc' ? (
                <Text style={styles.meta}>NPC {npcDifficulty.toUpperCase()}</Text>
              ) : (
                <Text style={styles.meta}>DUEL</Text>
              )}
            </View>

            <QuestionCard question={currentQuestion.question} turnLabel={turnLabel} />

            <View style={styles.answers}>
              {currentQuestion.options.map((opt) => (
                <AnswerButton
                  key={opt}
                  label={opt}
                  disabled={!activeIsHuman || gamePhase !== 'question'}
                  onPress={() => submitAnswer(opt)}
                />
              ))}
            </View>

            <View style={styles.logBox}>
              <Text style={styles.logTitle}>BATTLE LOG</Text>
              <ScrollView style={styles.logScroll} nestedScrollEnabled>
                {battleLog.map((line, i) => (
                  <Text key={`${line}-${i}`} style={styles.logLine}>
                    › {line}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </LinearGradient>
        </View>

        <FeedbackModal visible={gamePhase === 'feedback'} feedback={feedback} />

        <Modal visible={gamePhase === 'paused'} transparent animationType="fade">
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseCard}>
              <Text style={styles.pauseTitle}>PAUSE</Text>
              <AppButton title="LANJUTKAN" onPress={resumeGame} />
              <AppButton
                title="KELUAR KE MENU"
                variant="danger"
                onPress={() => {
                  useGameStore.getState().resetBattle();
                  void AudioManager.playBgm('menu');
                  navigation.navigate('MainMenu');
                }}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.arenaBottom },
  flex: { flex: 1 },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.navy,
  },
  fallbackText: { ...typography.body, color: colors.textInverse },
  hud: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  hudSide: { flex: 1, gap: 4 },
  hudRight: { alignItems: 'stretch' },
  hudName: {
    ...typography.hud,
    color: colors.gold,
    fontSize: 11,
  },
  alignRight: { textAlign: 'right' },
  hudScore: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
    opacity: 0.9,
  },
  hudCenter: { alignItems: 'center', gap: 6, paddingTop: 2 },
  vsText: {
    ...typography.subheading,
    color: colors.error,
    fontWeight: '900',
    textShadowColor: colors.gold,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
  },
  pauseBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.panelDark,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  arena: {
    height: 230,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  spotLight: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(245,197,24,0.08)',
  },
  stageFloor: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
    height: 22,
    borderRadius: radius.md,
    backgroundColor: '#152A48',
    borderWidth: 2,
    borderColor: 'rgba(245,197,24,0.35)',
  },
  stageEdge: {
    position: 'absolute',
    bottom: 22,
    left: 28,
    right: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    opacity: 0.55,
  },
  fighters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 42,
  },
  console: {
    flex: 1,
    marginTop: spacing.sm,
  },
  consoleInner: {
    flex: 1,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 3,
    borderColor: colors.gold,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    ...typography.hud,
    color: colors.navy,
    fontSize: 11,
  },
  answers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  logBox: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    padding: spacing.sm,
    minHeight: 56,
  },
  logTitle: { ...typography.hud, color: colors.gold, fontSize: 10 },
  logScroll: { flexGrow: 0 },
  logLine: { ...typography.caption, color: 'rgba(247,244,236,0.85)' },
  pauseOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  pauseCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.panelDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  pauseTitle: {
    ...typography.title,
    textAlign: 'center',
    color: colors.gold,
  },
});
