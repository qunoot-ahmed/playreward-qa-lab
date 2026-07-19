import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ProgressBar, StatusBadge } from '../components/ui';
import { GAME_NAME, getOverallProgress, OFFER_TEXT, OfferState, REWARD_COINS } from '../rewardRules';
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

type OffersScreenProps = {
  offerState: OfferState;
  onViewDetails: () => void;
  onOpenWallet: () => void;
  onOpenQaTools: () => void;
};

export function OffersScreen({
  offerState,
  onViewDetails,
  onOpenWallet,
  onOpenQaTools,
}: OffersScreenProps) {
  const progress = getOverallProgress(offerState);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.brandRow}>
        <View>
          <Text style={styles.brand}>PlayReward</Text>
          <Text style={styles.tagline}>Rewarded gaming QA lab</Text>
        </View>
        <View testID="header-wallet-balance" style={styles.walletChip}>
          <Text style={styles.walletLabel}>Wallet</Text>
          <Text style={styles.walletValue}>{offerState.walletBalance} coins</Text>
        </View>
      </View>

      <View style={styles.navRow}>
        <AppButton
          testID="nav-offers"
          title="Offers"
          variant="secondary"
          onPress={() => undefined}
          disabled
        />
        <AppButton testID="nav-wallet" title="Wallet" variant="ghost" onPress={onOpenWallet} />
        <AppButton
          testID="nav-qa-tools"
          title="QA Tools"
          variant="ghost"
          onPress={onOpenQaTools}
        />
      </View>

      <View testID="offer-card" style={styles.card}>
        <Text style={styles.gameName}>{GAME_NAME}</Text>
        <Text style={styles.offerText}>{OFFER_TEXT}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>Reward: {REWARD_COINS} coins</Text>
          <Text style={styles.metaItem}>Target: Level 5</Text>
          <Text style={styles.metaItem}>Deadline: 7 days</Text>
        </View>

        <StatusBadge
          testID="offer-status"
          label={statusLabels[offerState.status]}
          tone={statusTones[offerState.status]}
        />

        <ProgressBar
          testID="offer-progress-bar"
          valueTestID="offer-progress-value"
          completed={progress.completed}
          total={progress.total}
          label="Completed levels"
        />

        <AppButton testID="view-details" title="View Details" onPress={onViewDetails} />
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
  brandRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brand: {
    color: colors.brand,
    fontSize: 30,
    fontWeight: '900',
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  walletChip: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  walletLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  walletValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  navRow: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  gameName: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  offerText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  metaRow: {
    gap: 6,
  },
  metaItem: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
