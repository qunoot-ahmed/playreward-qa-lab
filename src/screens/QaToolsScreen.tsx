import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, ScreenHeader } from '../components/ui';
import { colors, radii, spacing } from '../theme';

type ConfirmKind = 'reset' | 'expiry' | null;

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
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);

  function handleConfirm() {
    if (confirmKind === 'reset') {
      onResetTestData();
    }

    if (confirmKind === 'expiry') {
      onSimulateOfferExpiry();
    }

    setConfirmKind(null);
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

      {confirmKind === 'reset' ? (
        <View
          testID="confirm-reset-panel"
          accessibilityRole="alert"
          style={styles.confirmPanel}
        >
          <Text style={styles.confirmTitle}>Confirm reset</Text>
          <Text style={styles.confirmBody}>
            This clears local offer progress, wallet balance, and reward history. This cannot be
            undone.
          </Text>
          <AppButton
            testID="confirm-reset-test-data"
            title="Confirm Reset"
            variant="danger"
            onPress={handleConfirm}
          />
          <AppButton
            testID="cancel-reset-test-data"
            title="Cancel"
            variant="ghost"
            onPress={() => setConfirmKind(null)}
          />
        </View>
      ) : null}

      {confirmKind === 'expiry' ? (
        <View
          testID="confirm-expiry-panel"
          accessibilityRole="alert"
          style={styles.confirmPanel}
        >
          <Text style={styles.confirmTitle}>Confirm simulate expiry</Text>
          <Text style={styles.confirmBody}>
            TEST ONLY: moves the offer start timestamp slightly more than seven days into the
            past, then evaluates expiry through normal business rules.
          </Text>
          <AppButton
            testID="confirm-simulate-offer-expiry"
            title="Confirm Simulate Expiry"
            variant="danger"
            onPress={handleConfirm}
          />
          <AppButton
            testID="cancel-simulate-offer-expiry"
            title="Cancel"
            variant="ghost"
            onPress={() => setConfirmKind(null)}
          />
        </View>
      ) : null}

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
          onPress={() => setConfirmKind('reset')}
          disabled={confirmKind !== null}
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
          onPress={() => setConfirmKind('expiry')}
          disabled={confirmKind !== null}
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
  confirmPanel: {
    backgroundColor: '#7f1d1d',
    borderRadius: radii.lg,
    gap: spacing.md,
    padding: spacing.md,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  confirmBody: {
    color: '#fecaca',
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
