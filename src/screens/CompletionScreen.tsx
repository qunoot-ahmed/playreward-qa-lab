import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ScreenHeader } from '../components/ui';
import { GAME_NAME, OfferState, REWARD_COINS, TARGET_LEVEL } from '../rewardRules';
import { colors, radii, spacing } from '../theme';

type CompletionScreenProps = {
  offerState: OfferState;
  onBackToOffers: () => void;
  onViewWallet: () => void;
};

export function CompletionScreen({
  offerState,
  onBackToOffers,
  onViewWallet,
}: CompletionScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Offer Complete"
        onBack={onBackToOffers}
        backTestID="nav-back-completion"
      />

      <View testID="completion-result" style={styles.card}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.body}>
          {GAME_NAME} Level {TARGET_LEVEL} completed
        </Text>
        <Text style={styles.reward}>{REWARD_COINS} coins earned</Text>
        <Text testID="wallet-balance" style={styles.balance}>
          Wallet balance: {offerState.walletBalance} coins
        </Text>
        <AppButton testID="view-wallet" title="View Wallet" onPress={onViewWallet} />
        <AppButton
          testID="back-to-offers"
          title="Back to Offers"
          variant="ghost"
          onPress={onBackToOffers}
        />
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.success,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  reward: {
    color: colors.brand,
    fontSize: 22,
    fontWeight: '800',
  },
  balance: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
