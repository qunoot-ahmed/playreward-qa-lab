import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  evaluateReward,
  initialOfferState,
  OFFER_TEXT,
  playNextLevel,
  startOffer,
  TARGET_LEVEL,
  OfferState,
} from './src/rewardRules';
import { clearOfferState, loadOfferState, saveOfferState } from './src/storage';

const statusLabels: Record<OfferState['status'], string> = {
  not_started: 'Not started',
  active: 'Active',
  rewarded: 'Reward granted',
  expired: 'Expired',
};

export default function App() {
  const [offerState, setOfferState] = useState<OfferState>(initialOfferState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function restoreState() {
      try {
        const savedState = await loadOfferState();
        setOfferState(evaluateReward(savedState, new Date()));
      } catch {
        Alert.alert('Storage Error', 'Saved test data could not be loaded.');
      } finally {
        setHasLoaded(true);
        setIsLoading(false);
      }
    }

    restoreState();
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    saveOfferState(offerState).catch(() => {
      Alert.alert('Storage Error', 'Test data could not be saved.');
    });
  }, [hasLoaded, offerState]);

  const rewardHistoryText = useMemo(() => {
    if (offerState.rewardHistory.length === 0) {
      return 'No rewards granted yet.';
    }

    return offerState.rewardHistory
      .map((reward) => `${reward.coins} coins granted for "${reward.offerText}"`)
      .join('\n');
  }, [offerState.rewardHistory]);

  function handleStartOffer() {
    setOfferState((currentState) => startOffer(currentState, new Date()));
  }

  function handlePlayNextLevel() {
    setOfferState((currentState) => playNextLevel(currentState, new Date()));
  }

  function handleResetTestData() {
    Alert.alert(
      'Reset Test Data',
      'This clears local offer progress, wallet balance, and reward history.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearOfferState();
            setOfferState(initialOfferState);
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const canStartOffer = offerState.status === 'not_started';
  const canPlayNextLevel =
    offerState.status === 'active' && offerState.currentLevel < TARGET_LEVEL;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Rewarded Gaming QA Lab</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Offer</Text>
          <Text style={styles.offerText}>{OFFER_TEXT}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <Text testID="Offer status" style={styles.statusText}>
            {statusLabels[offerState.status]}
          </Text>

          <Text style={styles.label}>Current level</Text>
          <Text testID="Current level" style={styles.valueText}>
            Level {offerState.currentLevel}
          </Text>

          <Text style={styles.label}>Wallet balance</Text>
          <Text testID="Wallet balance" style={styles.valueText}>
            {offerState.walletBalance} coins
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            testID="Start Offer"
            title="Start Offer"
            onPress={handleStartOffer}
            disabled={!canStartOffer}
          />
          <Button
            testID="Play Next Level"
            title="Play Next Level"
            onPress={handlePlayNextLevel}
            disabled={!canPlayNextLevel}
          />
          <Button
            testID="Reset Test Data"
            title="Reset Test Data"
            onPress={handleResetTestData}
            color="#b42318"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Reward history</Text>
          <Text testID="Reward history" style={styles.historyText}>
            {rewardHistoryText}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#101828',
    fontSize: 26,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    gap: 8,
    padding: 16,
  },
  label: {
    color: '#667085',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  offerText: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  statusText: {
    color: '#175cd3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  valueText: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    gap: 12,
  },
  historyText: {
    color: '#344054',
    fontSize: 16,
    lineHeight: 24,
  },
});
