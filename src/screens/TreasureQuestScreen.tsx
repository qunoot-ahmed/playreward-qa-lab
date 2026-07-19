import { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton, ScreenHeader } from '../components/ui';
import {
  getActiveTreasureId,
  getRemainingAttemptMs,
  getTreasurePosition,
  getTreasuresRequired,
} from '../gameRules';
import { canPlayGame, OfferState } from '../rewardRules';
import { colors, radii, spacing } from '../theme';

const TARGET_SIZE = 64;

type TreasureQuestScreenProps = {
  offerState: OfferState;
  now: Date;
  onBack: () => void;
  onEnsureAttempt: () => void;
  onCollectTreasure: (treasureId: string) => void;
  onRetryLevel: () => void;
  onTick: () => void;
};

export function TreasureQuestScreen({
  offerState,
  now,
  onBack,
  onEnsureAttempt,
  onCollectTreasure,
  onRetryLevel,
  onTick,
}: TreasureQuestScreenProps) {
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });
  const playable = canPlayGame(offerState);

  useEffect(() => {
    if (!playable) {
      return;
    }

    if (offerState.attemptEndTime === null && !offerState.attemptFailed) {
      onEnsureAttempt();
    }
  }, [
    playable,
    offerState.attemptEndTime,
    offerState.attemptFailed,
    offerState.currentLevel,
    onEnsureAttempt,
  ]);

  useEffect(() => {
    if (!playable || offerState.attemptFailed || offerState.attemptEndTime === null) {
      return;
    }

    const id = setInterval(() => {
      onTick();
    }, 250);

    return () => clearInterval(id);
  }, [playable, offerState.attemptEndTime, offerState.attemptFailed, onTick]);

  const required = getTreasuresRequired(offerState.currentLevel);
  const remainingMs =
    offerState.attemptEndTime !== null
      ? getRemainingAttemptMs(offerState.attemptEndTime, now)
      : 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  const treasureId = useMemo(
    () => getActiveTreasureId(offerState.currentLevel, offerState.attemptCollected),
    [offerState.attemptCollected, offerState.currentLevel],
  );

  const position = getTreasurePosition(offerState.currentLevel, offerState.attemptCollected);

  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setAreaSize({ width, height });
  }

  const canShowTarget =
    playable &&
    !offerState.attemptFailed &&
    offerState.attemptEndTime !== null &&
    areaSize.width > 0 &&
    areaSize.height > 0;

  const left = Math.max(
    0,
    Math.min(
      areaSize.width - TARGET_SIZE,
      position.x * areaSize.width - TARGET_SIZE / 2,
    ),
  );
  const top = Math.max(
    0,
    Math.min(
      areaSize.height - TARGET_SIZE,
      position.y * areaSize.height - TARGET_SIZE / 2,
    ),
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerPad}>
        <ScreenHeader
          title="Treasure Quest"
          subtitle={`Level ${offerState.currentLevel}`}
          onBack={onBack}
          backTestID="nav-back-game"
        />
      </View>

      <View style={styles.stats}>
        <Text testID="current-level" style={styles.stat}>
          Level {offerState.currentLevel}
        </Text>
        <Text testID="collected-count" style={styles.stat}>
          Collected {offerState.attemptCollected}/{required}
        </Text>
        <Text testID="remaining-time" style={styles.stat}>
          Time {offerState.attemptFailed ? 0 : remainingSeconds}s
        </Text>
      </View>

      {!playable ? (
        <View testID="game-blocked-message" style={styles.failureCard}>
          <Text style={styles.failureTitle}>Game unavailable</Text>
          <Text style={styles.failureBody}>
            This offer is expired or already completed. Game actions are blocked.
          </Text>
          <AppButton testID="back-from-blocked-game" title="Back" onPress={onBack} />
        </View>
      ) : offerState.attemptFailed ? (
        <View testID="level-failed-message" style={styles.failureCard}>
          <Text style={styles.failureTitle}>Level failed</Text>
          <Text style={styles.failureBody}>
            Time expired before you collected all treasures. Progress for completed levels is
            kept. Retry this level from zero treasures.
          </Text>
          <AppButton testID="retry-level" title="Retry Level" onPress={onRetryLevel} />
        </View>
      ) : (
        <View testID="game-area" style={styles.gameArea} onLayout={handleLayout}>
          {canShowTarget ? (
            <Pressable
              testID="treasure-target"
              accessibilityRole="button"
              accessibilityLabel="Treasure target"
              onPress={() => onCollectTreasure(treasureId)}
              style={[styles.treasure, { left, top }]}
            >
              <Text style={styles.treasureEmoji}>💎</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  stat: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.pill,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gameArea: {
    backgroundColor: '#0b1220',
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  treasure: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    height: TARGET_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    width: TARGET_SIZE,
  },
  treasureEmoji: {
    fontSize: 28,
  },
  failureCard: {
    backgroundColor: '#7f1d1d',
    borderRadius: radii.lg,
    gap: spacing.md,
    margin: spacing.lg,
    padding: spacing.lg,
  },
  failureTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  failureBody: {
    color: '#fecaca',
    fontSize: 15,
    lineHeight: 22,
  },
});
