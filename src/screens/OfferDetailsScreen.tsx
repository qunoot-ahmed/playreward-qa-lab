import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ProgressBar, ScreenHeader, StatusBadge } from '../components/ui';
import {
  canPlayGame,
  GAME_NAME,
  getDeadlineTime,
  getOverallProgress,
  OFFER_TEXT,
  OfferState,
  REWARD_COINS,
  TARGET_LEVEL,
} from '../rewardRules';
import { colors, radii, spacing } from '../theme';

const statusLabels: Record<OfferState['status'], string> = {
  not_started: 'Not started',
  active: 'Active',
  rewarded: 'Completed',
  expired: 'Expired',
};

const statusTones: Record<
  OfferState['status'],
  'neutral' | 'active' | 'success' | 'danger' | 'warning'
> = {
  not_started: 'neutral',
  active: 'active',
  rewarded: 'success',
  expired: 'danger',
};

type OfferDetailsScreenProps = {
  offerState: OfferState;
  now: Date;
  onBack: () => void;
  onStartOffer: () => void;
  onContinuePlaying: () => void;
  onOpenWallet: () => void;
};

function formatDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }

  return new Date(iso).toLocaleString();
}

export function OfferDetailsScreen({
  offerState,
  now,
  onBack,
  onStartOffer,
  onContinuePlaying,
  onOpenWallet,
}: OfferDetailsScreenProps) {
  const progress = getOverallProgress(offerState);
  const canStart = offerState.status === 'not_started';
  const canContinue = canPlayGame(offerState);
  const deadlineIso =
    offerState.offerStartTime !== null
      ? new Date(getDeadlineTime(offerState.offerStartTime)).toISOString()
      : null;

  let timeRemaining = '—';
  if (offerState.offerStartTime && offerState.status === 'active') {
    const remainingMs = getDeadlineTime(offerState.offerStartTime) - now.getTime();
    if (remainingMs <= 0) {
      timeRemaining = 'Expired';
    } else {
      const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      timeRemaining = `${days}d ${hours}h remaining`;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Offer Details" onBack={onBack} backTestID="nav-back-details" />

      <View style={styles.card}>
        <Text style={styles.label}>Game</Text>
        <Text style={styles.value}>{GAME_NAME}</Text>

        <Text style={styles.label}>Offer</Text>
        <Text style={styles.offerText}>{OFFER_TEXT}</Text>

        <Text style={styles.label}>Reward</Text>
        <Text style={styles.value}>{REWARD_COINS} coins</Text>

        <Text style={styles.label}>Requirement</Text>
        <Text style={styles.value}>Complete Level {TARGET_LEVEL} within 7 days</Text>

        <Text style={styles.label}>Status</Text>
        <StatusBadge
          testID="offer-status"
          label={statusLabels[offerState.status]}
          tone={statusTones[offerState.status]}
        />

        <Text style={styles.label}>Start date</Text>
        <Text style={styles.value}>{formatDate(offerState.offerStartTime)}</Text>

        <Text style={styles.label}>Deadline</Text>
        <Text style={styles.value}>{formatDate(deadlineIso)}</Text>

        <Text style={styles.label}>Time remaining</Text>
        <Text style={styles.value}>{timeRemaining}</Text>

        <Text style={styles.label}>Current level</Text>
        <Text testID="current-level" style={styles.value}>
          {offerState.status === 'not_started'
            ? 'Not started'
            : offerState.status === 'rewarded'
              ? `Level ${TARGET_LEVEL} completed`
              : `Level ${offerState.currentLevel} unlocked`}
        </Text>

        <ProgressBar
          testID="offer-progress-bar"
          valueTestID="offer-progress-value"
          completed={progress.completed}
          total={progress.total}
          label="Completed levels"
        />

        {offerState.status === 'expired' ? (
          <View testID="expiration-reason" style={styles.noticeDanger}>
            <Text style={styles.noticeTitle}>Offer expired</Text>
            <Text style={styles.noticeBody}>
              The 7-day deadline has passed. Game actions are blocked and no reward can be
              granted.
            </Text>
          </View>
        ) : null}

        {offerState.status === 'rewarded' ? (
          <View testID="completion-notice" style={styles.noticeSuccess}>
            <Text style={styles.noticeTitle}>Offer completed</Text>
            <Text style={styles.noticeBody}>
              {REWARD_COINS} coins were already granted. This offer cannot be restarted.
            </Text>
            <AppButton testID="view-wallet-from-details" title="View Wallet" onPress={onOpenWallet} />
          </View>
        ) : null}

        {canStart ? (
          <AppButton testID="start-offer" title="Start Offer" onPress={onStartOffer} />
        ) : null}

        {canContinue ? (
          <AppButton
            testID="continue-playing"
            title="Continue Playing"
            onPress={onContinuePlaying}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  offerText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  noticeDanger: {
    backgroundColor: '#7f1d1d',
    borderRadius: radii.md,
    gap: 8,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  noticeSuccess: {
    backgroundColor: '#14532d',
    borderRadius: radii.md,
    gap: 8,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  noticeBody: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
});
