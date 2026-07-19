import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View } from 'react-native';

import { CompletionScreen } from './src/screens/CompletionScreen';
import { OfferDetailsScreen } from './src/screens/OfferDetailsScreen';
import { OffersScreen } from './src/screens/OffersScreen';
import { QaToolsScreen } from './src/screens/QaToolsScreen';
import { TreasureQuestScreen } from './src/screens/TreasureQuestScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import {
  collectTreasure,
  evaluateAttempt,
  evaluateReward,
  initialOfferState,
  OfferState,
  retryLevelAttempt,
  simulateOfferExpiry,
  startLevelAttempt,
  startOffer,
} from './src/rewardRules';
import { clearOfferState, loadOfferState, saveOfferState } from './src/storage';
import { colors } from './src/theme';

type ScreenName = 'offers' | 'details' | 'game' | 'completion' | 'wallet' | 'qaTools';

function sameAttemptSlice(a: OfferState, b: OfferState): boolean {
  return (
    a.status === b.status &&
    a.currentLevel === b.currentLevel &&
    a.completedLevels === b.completedLevels &&
    a.attemptCollected === b.attemptCollected &&
    a.attemptStartTime === b.attemptStartTime &&
    a.attemptEndTime === b.attemptEndTime &&
    a.attemptFailed === b.attemptFailed &&
    a.walletBalance === b.walletBalance &&
    a.rewardGranted === b.rewardGranted &&
    a.offerStartTime === b.offerStartTime
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('offers');
  const [offerState, setOfferState] = useState<OfferState>(initialOfferState);
  const [now, setNow] = useState(() => new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const previousStatusRef = useRef<OfferState['status']>('not_started');

  useEffect(() => {
    async function restoreState() {
      try {
        const savedState = await loadOfferState();
        const evaluated = evaluateReward(savedState, new Date());
        previousStatusRef.current = evaluated.status;
        setOfferState(evaluated);
        setNow(new Date());
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

  useEffect(() => {
    const wasActive = previousStatusRef.current === 'active';
    if (wasActive && offerState.status === 'rewarded' && screen === 'game') {
      setScreen('completion');
    }
    previousStatusRef.current = offerState.status;
  }, [offerState.status, screen]);

  const updateState = useCallback((updater: (current: OfferState) => OfferState) => {
    setOfferState((current) => {
      const next = updater(current);
      return sameAttemptSlice(current, next) && current.rewardHistory === next.rewardHistory
        ? current
        : next;
    });
    setNow(new Date());
  }, []);

  const handleStartOffer = useCallback(() => {
    updateState((current) => startOffer(current, new Date()));
  }, [updateState]);

  const handleEnsureAttempt = useCallback(() => {
    updateState((current) => startLevelAttempt(current, new Date()));
  }, [updateState]);

  const handleCollectTreasure = useCallback(
    (treasureId: string) => {
      updateState((current) => collectTreasure(current, new Date(), treasureId));
    },
    [updateState],
  );

  const handleRetryLevel = useCallback(() => {
    updateState((current) => retryLevelAttempt(current, new Date()));
  }, [updateState]);

  const handleTick = useCallback(() => {
    updateState((current) => evaluateAttempt(evaluateReward(current, new Date()), new Date()));
  }, [updateState]);

  const handleResetTestData = useCallback(async () => {
    await clearOfferState();
    previousStatusRef.current = 'not_started';
    setOfferState(initialOfferState);
    setNow(new Date());
    setScreen('offers');
  }, []);

  const handleSimulateOfferExpiry = useCallback(() => {
    updateState((current) => simulateOfferExpiry(current, new Date()));
  }, [updateState]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'offers' ? (
        <OffersScreen
          offerState={offerState}
          onViewDetails={() => setScreen('details')}
          onOpenWallet={() => setScreen('wallet')}
          onOpenQaTools={() => setScreen('qaTools')}
        />
      ) : null}

      {screen === 'details' ? (
        <OfferDetailsScreen
          offerState={offerState}
          now={now}
          onBack={() => setScreen('offers')}
          onStartOffer={handleStartOffer}
          onContinuePlaying={() => setScreen('game')}
          onOpenWallet={() => setScreen('wallet')}
        />
      ) : null}

      {screen === 'game' ? (
        <TreasureQuestScreen
          offerState={offerState}
          now={now}
          onBack={() => setScreen('details')}
          onEnsureAttempt={handleEnsureAttempt}
          onCollectTreasure={handleCollectTreasure}
          onRetryLevel={handleRetryLevel}
          onTick={handleTick}
        />
      ) : null}

      {screen === 'completion' ? (
        <CompletionScreen
          offerState={offerState}
          onBackToOffers={() => setScreen('offers')}
          onViewWallet={() => setScreen('wallet')}
        />
      ) : null}

      {screen === 'wallet' ? (
        <WalletScreen
          offerState={offerState}
          onBack={() => setScreen('offers')}
          onOpenOffers={() => setScreen('offers')}
          onOpenQaTools={() => setScreen('qaTools')}
        />
      ) : null}

      {screen === 'qaTools' ? (
        <QaToolsScreen
          onBack={() => setScreen('offers')}
          onOpenOffers={() => setScreen('offers')}
          onOpenWallet={() => setScreen('wallet')}
          onResetTestData={handleResetTestData}
          onSimulateOfferExpiry={handleSimulateOfferExpiry}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
