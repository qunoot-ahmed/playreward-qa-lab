import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialOfferState, OfferState } from './rewardRules';

const STORAGE_KEY = 'playreward-qa-lab:offer-state';

export async function loadOfferState(): Promise<OfferState> {
  const savedState = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedState === null) {
    return initialOfferState;
  }

  return {
    ...initialOfferState,
    ...JSON.parse(savedState),
  };
}

export async function saveOfferState(state: OfferState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearOfferState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
