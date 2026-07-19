# Manual Test Scenarios

## Smoke — happy path

1. Launch app: Offers shows PlayReward branding, wallet `0`, Treasure Quest card, status Not started, progress `0/5`.
2. View Details → Start Offer → status Active, current level Level 1 unlocked, progress still `0/5`.
3. Continue Playing → collect required treasures for Levels 1–5 within each 15s window.
4. After Level 5: Completion shows congratulations, 500 coins earned, wallet 500.
5. View Wallet → one granted transaction for Treasure Quest; balance 500.
6. Return to Offers/Details → Completed; Start/Continue unavailable; progress `5/5`.

## Failure and retry

1. Start offer and enter Level 1.
2. Let the 15s attempt expire without collecting.
3. Confirm **Level failed**, level still 1, progress still `0/5`, wallet unchanged.
4. Retry Level → collected resets to 0, new 15s timer, complete the level.
5. Confirm progress becomes `1/5` and Level 2 unlocks.

## Rapid tap protection

1. On any level, tap the same treasure target as fast as possible.
2. Confirm collected count increases by one per successful target only.
3. Confirm no skipped levels and no extra wallet credits.

## Persistence / absolute timer

1. Start a level attempt and note remaining time.
2. Background the app for several seconds, then return.
3. Confirm remaining time decreased by roughly elapsed wall time (timer did not pause).
4. Optionally wait until after `attemptEndTime`, reopen, and confirm failed state with retry.

## Offer expiry

1. Start offer.
2. QA Tools → Simulate Offer Expiry → confirm.
3. Offer Details shows Expired and blocking reason; Continue Playing unavailable.
4. Confirm wallet/history unchanged if Level 5 was not completed.

## Reward once

1. Complete the offer once (wallet 500, one history row).
2. Reopen app / revisit screens / attempt any play action.
3. Confirm wallet stays 500 and history stays a single grant.

## Reset

1. With any progress present, QA Tools → Reset Test Data → Cancel → data unchanged.
2. Reset again → confirm → not started, level 0, wallet 0, empty history, Offers screen.

## Version 1 migration (if old data present)

1. If a V1 save exists, launch V2 once.
2. App must not crash.
3. Prior wallet balance and rewardGranted should remain when previously valid.
4. New attempt fields default safely.

## Deadline logic review

Boundary checks for offer deadline remain in `src/rewardRules.ts` (`isWithinDeadline`, `evaluateReward`). Attempt expiry uses `attemptEndTime` in `src/gameRules.ts` / `evaluateAttempt`.
