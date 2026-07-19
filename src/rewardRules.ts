export const OFFER_TEXT = 'Reach Level 5 within 7 days and earn 500 coins.';
export const START_LEVEL = 1;
export const TARGET_LEVEL = 5;
export const REWARD_COINS = 500;
export const OFFER_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type OfferStatus = 'not_started' | 'active' | 'rewarded' | 'expired';

export type RewardHistoryItem = {
  id: string;
  offerText: string;
  coins: number;
  grantedAt: string;
};

export type OfferState = {
  status: OfferStatus;
  currentLevel: number;
  offerStartTime: string | null;
  walletBalance: number;
  rewardGranted: boolean;
  rewardHistory: RewardHistoryItem[];
};

export const initialOfferState: OfferState = {
  status: 'not_started',
  currentLevel: 0,
  offerStartTime: null,
  walletBalance: 0,
  rewardGranted: false,
  rewardHistory: [],
};

export function getDeadlineTime(startTime: string): number {
  return new Date(startTime).getTime() + OFFER_DURATION_MS;
}

export function isWithinDeadline(startTime: string, now: Date): boolean {
  return now.getTime() <= getDeadlineTime(startTime);
}

export function startOffer(state: OfferState, now: Date): OfferState {
  if (state.status !== 'not_started') {
    return state;
  }

  return {
    ...state,
    status: 'active',
    currentLevel: START_LEVEL,
    offerStartTime: now.toISOString(),
  };
}

export function playNextLevel(state: OfferState, now: Date): OfferState {
  if (state.status !== 'active' || state.offerStartTime === null) {
    return state;
  }

  if (!isWithinDeadline(state.offerStartTime, now)) {
    return {
      ...state,
      status: 'expired',
    };
  }

  const nextLevel = Math.min(state.currentLevel + 1, TARGET_LEVEL);
  const progressedState: OfferState = {
    ...state,
    currentLevel: nextLevel,
  };

  return evaluateReward(progressedState, now);
}

export function evaluateReward(state: OfferState, now: Date): OfferState {
  if (state.status !== 'active' || state.offerStartTime === null) {
    return state;
  }

  if (state.currentLevel >= TARGET_LEVEL) {
    if (state.rewardGranted || !isWithinDeadline(state.offerStartTime, now)) {
      return {
        ...state,
        status: state.rewardGranted ? 'rewarded' : 'expired',
      };
    }

    const historyItem: RewardHistoryItem = {
      id: `reward-${now.toISOString()}`,
      offerText: OFFER_TEXT,
      coins: REWARD_COINS,
      grantedAt: now.toISOString(),
    };

    return {
      ...state,
      status: 'rewarded',
      currentLevel: TARGET_LEVEL,
      walletBalance: state.walletBalance + REWARD_COINS,
      rewardGranted: true,
      rewardHistory: [...state.rewardHistory, historyItem],
    };
  }

  if (!isWithinDeadline(state.offerStartTime, now)) {
    return {
      ...state,
      status: 'expired',
    };
  }

  return state;
}
