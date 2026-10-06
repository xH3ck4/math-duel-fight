import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import type { FeedbackState } from '../../types/game';
import { colors, radius, spacing, typography } from '../../theme';

interface Props {
  visible: boolean;
  feedback: FeedbackState | null;
}

export function FeedbackModal({ visible, feedback }: Props) {
  if (!feedback) return null;

  const correct = feedback.isCorrect;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, correct ? styles.ok : styles.bad]}>
          <Text style={styles.title}>
            {feedback.isTimeout ? "⏰ TIME'S UP!" : correct ? '✅ BENAR!' : '❌ SALAH!'}
          </Text>
          {!correct && (
            <Text style={styles.line}>
              Jawaban yang benar: <Text style={styles.bold}>{feedback.correctAnswer}</Text>
            </Text>
          )}
          <Text style={styles.line}>Penjelasan:</Text>
          <Text style={styles.explain}>{feedback.explanation}</Text>
          <Text style={styles.damage}>
            {correct ? `💥 Damage: ${feedback.damage}` : `💔 Self-damage: ${feedback.damage}`}
          </Text>
          <Text style={styles.score}>
            Skor: {feedback.scoreGained >= 0 ? '+' : ''}
            {feedback.scoreGained}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  ok: {
    backgroundColor: colors.successBg,
    borderWidth: 3,
    borderColor: colors.success,
  },
  bad: {
    backgroundColor: colors.errorBg,
    borderWidth: 3,
    borderColor: colors.error,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    color: colors.text,
  },
  line: {
    ...typography.body,
    color: colors.text,
  },
  bold: {
    fontWeight: '900',
    color: colors.primaryDark,
  },
  explain: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '700',
  },
  damage: {
    ...typography.subheading,
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.secondaryDark,
  },
  score: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: '700',
  },
});
