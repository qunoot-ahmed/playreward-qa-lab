import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ScreenHeader } from '../components/ui';
import { OfferState } from '../rewardRules';
import { colors, radii, spacing } from '../theme';

type WalletScreenProps = {
  offerState: OfferState;
  onBack: () => void;
  onOpenOffers: () => void;
  onOpenQaTools: () => void;
};

export function WalletScreen({
  offerState,
  onBack,
  onOpenOffers,
  onOpenQaTools,
}: WalletScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Wallet" onBack={onBack} backTestID="nav-back-wallet" />

      <View style={styles.navRow}>
        <AppButton testID="nav-offers" title="Offers" variant="ghost" onPress={onOpenOffers} />
        <AppButton testID="nav-wallet" title="Wallet" variant="secondary" onPress={() => undefined} disabled />
        <AppButton testID="nav-qa-tools" title="QA Tools" variant="ghost" onPress={onOpenQaTools} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.label}>Total coin balance</Text>
        <Text testID="wallet-balance" style={styles.balance}>
          {offerState.walletBalance} coins
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Reward transaction history</Text>
      <Text testID="reward-transaction-count" style={styles.transactionCount}>
        Transactions: {offerState.rewardHistory.length}
      </Text>

      {offerState.rewardHistory.length === 0 ? (
        <View testID="reward-history-empty" style={styles.card}>
          <Text style={styles.empty}>No rewards granted yet.</Text>
        </View>
      ) : (
        offerState.rewardHistory.map((item) => (
          <View key={item.id} testID="reward-transaction" style={styles.card}>
            <Text style={styles.txGame}>{item.gameName}</Text>
            <Text style={styles.txOffer}>{item.offerText}</Text>
            <Text style={styles.txAmount}>+{item.coins} coins</Text>
            <Text style={styles.txMeta}>
              {new Date(item.grantedAt).toLocaleString()}
            </Text>
            <Text style={styles.txStatus}>Status: {item.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  navRow: {
    gap: spacing.sm,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderColor: colors.brand,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  balance: {
    color: colors.brand,
    fontSize: 32,
    fontWeight: '900',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  transactionCount: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
  },
  txGame: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  txOffer: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  txAmount: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '800',
  },
  txMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  txStatus: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
