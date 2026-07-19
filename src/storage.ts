import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GAME_NAME,
  initialOfferState,
  OFFER_TEXT,
  OfferState,
  RewardHistoryItem,
  TARGET_LEVEL,
} from './rewardRules';

const STORAGE_KEY = 'playreward-qa-lab:offer-state';

type RawRewardHistoryItem = Partial<RewardHistoryItem> & {
  offerText?: string;
  coins?: number;
  grantedAt?: string;
  id?: string;
};

type RawOfferState = Partial<OfferState> & {
  rewardHistory?: RawRewardHistoryItem[];
};

function migrateRewardHistory(items: RawRewardHistoryItem[] | undefined): RewardHistoryItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id: typeof item.id === 'string' ? item.id : `reward-migrated-${index}`,
    gameName: typeof item.gameName === 'string' ? item.gameName : GAME_NAME,
    offerText: typeof item.offerText === 'string' ? item.offerText : OFFER_TEXT,
    coins: typeof item.coins === 'number' ? item.coins : 0,
    grantedAt:
      typeof item.grantedAt === 'string' ? item.grantedAt : new Date(0).toISOString(),
    status: 'granted' as const,
  }));
}

/**
 * Maps Version 1 persisted shapes onto Version 2 fields without crashing.
 * Preserves wallet balance and rewardGranted when present and valid.
 */
export function migrateOfferState(raw: RawOfferState | null | undefined): OfferState {
  if (raw == null || typeof raw !== 'object') {
    return initialOfferState;
  }

  const status = raw.status ?? initialOfferState.status;
  const legacyLevel =
    typeof raw.currentLevel === 'number' && Number.isFinite(raw.currentLevel)
      ? raw.currentLevel
      : initialOfferState.currentLevel;

  let completedLevels =
    typeof raw.completedLevels === 'number' && Number.isFinite(raw.completedLevels)
      ? raw.completedLevels
      : undefined;

  let currentLevel = legacyLevel;

  if (completedLevels === undefined) {
    if (status === 'rewarded' || raw.rewardGranted === true) {
      completedLevels = TARGET_LEVEL;
      currentLevel = TARGET_LEVEL;
    } else if (status === 'not_started') {
      completedLevels = 0;
      currentLevel = 0;
    } else {
      // V1 currentLevel was the unlocked/playable level (1–5).
      completedLevels = Math.max(0, Math.min(TARGET_LEVEL, legacyLevel - 1));
      currentLevel = Math.max(0, Math.min(TARGET_LEVEL, legacyLevel));
    }
  }

  if (status === 'rewarded') {
    completedLevels = TARGET_LEVEL;
    currentLevel = TARGET_LEVEL;
  }

  const walletBalance =
    typeof raw.walletBalance === 'number' && Number.isFinite(raw.walletBalance)
      ? raw.walletBalance
      : initialOfferState.walletBalance;

  return {
    ...initialOfferState,
    status,
    currentLevel,
    completedLevels: Math.max(0, Math.min(TARGET_LEVEL, completedLevels)),
    offerStartTime:
      typeof raw.offerStartTime === 'string' || raw.offerStartTime === null
        ? raw.offerStartTime
        : initialOfferState.offerStartTime,
    walletBalance,
    rewardGranted:
      typeof raw.rewardGranted === 'boolean'
        ? raw.rewardGranted
        : initialOfferState.rewardGranted,
    rewardHistory: migrateRewardHistory(raw.rewardHistory),
    attemptCollected:
      typeof raw.attemptCollected === 'number' && Number.isFinite(raw.attemptCollected)
        ? Math.max(0, raw.attemptCollected)
        : 0,
    attemptStartTime:
      typeof raw.attemptStartTime === 'string' || raw.attemptStartTime === null
        ? (raw.attemptStartTime ?? null)
        : null,
    attemptEndTime:
      typeof raw.attemptEndTime === 'string' || raw.attemptEndTime === null
        ? (raw.attemptEndTime ?? null)
        : null,
    attemptFailed:
      typeof raw.attemptFailed === 'boolean' ? raw.attemptFailed : false,
  };
}

export async function loadOfferState(): Promise<OfferState> {
  const savedState = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedState === null) {
    return initialOfferState;
  }

  try {
    const parsed = JSON.parse(savedState) as RawOfferState;
    return migrateOfferState(parsed);
  } catch {
    return initialOfferState;
  }
}

export async function saveOfferState(state: OfferState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearOfferState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
