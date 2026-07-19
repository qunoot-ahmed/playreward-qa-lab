import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ScreenHeader } from '../components/ui';
import { colors, radii, spacing } from '../theme';

type QaToolsScreenProps = {
  onBack: () => void;
  onOpenOffers: () => void;
  onOpenWallet: () => void;
  onResetTestData: () => void;
  onSimulateOfferExpiry: () => void;
};

export function QaToolsScreen({
  onBack,
  onOpenOffers,
  onOpenWallet,
  onResetTestData,
  onSimulateOfferExpiry,
}: QaToolsScreenProps) {
  function confirmReset() {
    Alert.alert(
      'Reset Test Data',
      'This clears local offer progress, wallet balance, and reward history.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => undefined },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: onResetTestData,
        },
      ],
      { cancelable: true },
    );
  }

  function confirmSimulateExpiry() {
    Alert.alert(
      'Simulate Offer Expiry',
      'TEST ONLY: moves the offer start timestamp slightly more than seven days into the past, then evaluates expiry through normal business rules.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => undefined },
        {
          text: 'Simulate Expiry',
          style: 'destructive',
          onPress: onSimulateOfferExpiry,
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="QA Tools" onBack={onBack} backTestID="nav-back-qa-tools" />

      <View style={styles.navRow}>
        <AppButton testID="nav-offers" title="Offers" variant="ghost" onPress={onOpenOffers} />
        <AppButton testID="nav-wallet" title="Wallet" variant="ghost" onPress={onOpenWallet} />
        <AppButton
          testID="nav-qa-tools"
          title="QA Tools"
          variant="secondary"
          onPress={() => undefined}
          disabled
        />
      </View>

      <View testID="qa-tools-banner" style={styles.banner}>
        <Text style={styles.bannerTitle}>Test-only area</Text>
        <Text style={styles.bannerBody}>
          QA Tools are for local verification. They are not part of the player journey and must
          not be treated as production features.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reset Test Data</Text>
        <Text style={styles.cardBody}>
          Clears persisted offer state, attempt data, wallet balance, and reward history after
          confirmation.
        </Text>
        <AppButton
          testID="reset-test-data"
          title="Reset Test Data"
          variant="danger"
          onPress={confirmReset}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Simulate Offer Expiry</Text>
        <Text style={styles.cardBody}>
          Rewrites the stored offer-start timestamp to slightly more than seven days ago, then
          runs the normal deadline evaluation. Does not bypass reward rules.
        </Text>
        <AppButton
          testID="simulate-offer-expiry"
          title="Simulate Offer Expiry"
          variant="danger"
          onPress={confirmSimulateExpiry}
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
  navRow: {
    gap: spacing.sm,
  },
  banner: {
    backgroundColor: '#78350f',
    borderRadius: radii.lg,
    gap: spacing.sm,
    padding: spacing.md,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  bannerBody: {
    color: '#fde68a',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
