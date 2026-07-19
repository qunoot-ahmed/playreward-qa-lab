import {
  getActiveTreasureId,
  getTreasuresRequired,
  isAttemptExpired,
  LEVEL_ATTEMPT_DURATION_MS,
  MAX_LEVEL,
} from './gameRules';

export const GAME_NAME = 'Treasure Quest';
export const OFFER_TEXT =
  'Complete Treasure Quest Level 5 within 7 days and earn 500 coins.';
export const START_LEVEL = 1;
export const TARGET_LEVEL = MAX_LEVEL;
export const REWARD_COINS = 500;
export const OFFER_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type OfferStatus = 'not_started' | 'active' | 'rewarded' | 'expired';

export type RewardHistoryItem = {
  id: string;
  gameName: string;
  offerText: string;
  coins: number;
  grantedAt: string;
  status: 'granted';
};

export type OfferState = {
  status: OfferStatus;
  /** Level currently available to play (0 when not started). */
  currentLevel: number;
  /** Fully completed levels (0–5). Drives Offer Details progress. */
  completedLevels: number;
  offerStartTime: string | null;
  walletBalance: number;
  rewardGranted: boolean;
  rewardHistory: RewardHistoryItem[];
  attemptCollected: number;
  attemptStartTime: string | null;
  attemptEndTime: string | null;
  attemptFailed: boolean;
};

export const initialOfferState: OfferState = {
  status: 'not_started',
  currentLevel: 0,
  completedLevels: 0,
  offerStartTime: null,
  walletBalance: 0,
  rewardGranted: false,
  rewardHistory: [],
  attemptCollected: 0,
  attemptStartTime: null,
  attemptEndTime: null,
  attemptFailed: false,
};

export function getDeadlineTime(startTime: string): number {
  return new Date(startTime).getTime() + OFFER_DURATION_MS;
}

export function isWithinDeadline(startTime: string, now: Date): boolean {
  return now.getTime() <= getDeadlineTime(startTime);
}

export function getOverallProgress(state: OfferState): { completed: number; total: number } {
  if (state.status === 'not_started') {
    return { completed: 0, total: TARGET_LEVEL };
  }

  if (state.status === 'rewarded') {
    return { completed: TARGET_LEVEL, total: TARGET_LEVEL };
  }

  return { completed: state.completedLevels, total: TARGET_LEVEL };
}

function clearAttemptFields(state: OfferState): OfferState {
  return {
    ...state,
    attemptCollected: 0,
    attemptStartTime: null,
    attemptEndTime: null,
    attemptFailed: false,
  };
}

function grantReward(state: OfferState, now: Date): OfferState {
  if (state.rewardGranted) {
    return {
      ...state,
      status: 'rewarded',
      currentLevel: TARGET_LEVEL,
      completedLevels: TARGET_LEVEL,
    };
  }

  const historyItem: RewardHistoryItem = {
    id: `reward-${now.toISOString()}`,
    gameName: GAME_NAME,
    offerText: OFFER_TEXT,
    coins: REWARD_COINS,
    grantedAt: now.toISOString(),
    status: 'granted',
  };

  return clearAttemptFields({
    ...state,
    status: 'rewarded',
    currentLevel: TARGET_LEVEL,
    completedLevels: TARGET_LEVEL,
    walletBalance: state.walletBalance + REWARD_COINS,
    rewardGranted: true,
    rewardHistory: [...state.rewardHistory, historyItem],
  });
}

export function evaluateReward(state: OfferState, now: Date): OfferState {
  if (state.status === 'rewarded') {
    return {
      ...state,
      currentLevel: TARGET_LEVEL,
      completedLevels: TARGET_LEVEL,
    };
  }

  if (state.status !== 'active' || state.offerStartTime === null) {
    return state;
  }

  if (state.completedLevels >= TARGET_LEVEL) {
    if (!isWithinDeadline(state.offerStartTime, now)) {
      return clearAttemptFields({
        ...state,
        status: 'expired',
      });
    }

    return grantReward(state, now);
  }

  if (!isWithinDeadline(state.offerStartTime, now)) {
    return clearAttemptFields({
      ...state,
      status: 'expired',
    });
  }

  return evaluateAttempt(state, now);
}

export function evaluateAttempt(state: OfferState, now: Date): OfferState {
  if (state.status !== 'active' || state.attemptEndTime === null || state.attemptFailed) {
    return state;
  }

  if (isAttemptExpired(state.attemptEndTime, now)) {
    return {
      ...state,
      attemptFailed: true,
    };
  }

  return state;
}

export function startOffer(state: OfferState, now: Date): OfferState {
  if (state.status !== 'not_started') {
    return state;
  }

  return clearAttemptFields({
    ...state,
    status: 'active',
    currentLevel: START_LEVEL,
    completedLevels: 0,
    offerStartTime: now.toISOString(),
  });
}

export function canPlayGame(state: OfferState): boolean {
  return (
    state.status === 'active' &&
    state.currentLevel >= START_LEVEL &&
    state.currentLevel <= TARGET_LEVEL &&
    state.completedLevels < TARGET_LEVEL
  );
}

export function startLevelAttempt(state: OfferState, now: Date): OfferState {
  const evaluated = evaluateReward(state, now);

  if (!canPlayGame(evaluated)) {
    return evaluated;
  }

  if (
    evaluated.attemptStartTime !== null &&
    evaluated.attemptEndTime !== null &&
    !evaluated.attemptFailed
  ) {
    return evaluateAttempt(evaluated, now);
  }

  const end = new Date(now.getTime() + LEVEL_ATTEMPT_DURATION_MS);

  return {
    ...evaluated,
    attemptCollected: 0,
    attemptStartTime: now.toISOString(),
    attemptEndTime: end.toISOString(),
    attemptFailed: false,
  };
}

export function retryLevelAttempt(state: OfferState, now: Date): OfferState {
  const evaluated = evaluateReward(state, now);

  if (!canPlayGame(evaluated)) {
    return evaluated;
  }

  const end = new Date(now.getTime() + LEVEL_ATTEMPT_DURATION_MS);

  return {
    ...evaluated,
    attemptCollected: 0,
    attemptStartTime: now.toISOString(),
    attemptEndTime: end.toISOString(),
    attemptFailed: false,
  };
}

/**
 * Accepts a treasure tap only when treasureId matches the active target.
 * Rapid taps on the same target cannot double-count.
 */
export function collectTreasure(
  state: OfferState,
  now: Date,
  treasureId: string,
): OfferState {
  let next = evaluateReward(state, now);

  if (!canPlayGame(next) || next.attemptFailed || next.attemptEndTime === null) {
    return next;
  }

  next = evaluateAttempt(next, now);
  if (next.attemptFailed) {
    return next;
  }

  const expectedId = getActiveTreasureId(next.currentLevel, next.attemptCollected);
  if (treasureId !== expectedId) {
    return next;
  }

  const required = getTreasuresRequired(next.currentLevel);
  const collected = next.attemptCollected + 1;

  if (collected < required) {
    return {
      ...next,
      attemptCollected: collected,
    };
  }

  const completedLevels = next.completedLevels + 1;

  if (completedLevels >= TARGET_LEVEL) {
    return grantReward(
      {
        ...next,
        completedLevels: TARGET_LEVEL,
        currentLevel: TARGET_LEVEL,
      },
      now,
    );
  }

  return clearAttemptFields({
    ...next,
    completedLevels,
    currentLevel: completedLevels + 1,
  });
}

/**
 * Test-only: moves offer start slightly more than seven days into the past,
 * then evaluates expiry through the normal deadline rules.
 */
export function simulateOfferExpiry(state: OfferState, now: Date): OfferState {
  if (state.status !== 'active' || state.offerStartTime === null) {
    return state;
  }

  const pastStart = new Date(now.getTime() - OFFER_DURATION_MS - 1000);

  return evaluateReward(
    {
      ...state,
      offerStartTime: pastStart.toISOString(),
    },
    now,
  );
}
