# Manual Test Scenarios

## Initial Checks

1. Launch the app in Expo Go and confirm the offer text is exactly "Reach Level 5 within 7 days and earn 500 coins."
2. Tap `Start Offer` and confirm status becomes active and current level becomes Level 1.
3. Tap `Play Next Level` once and confirm current level increases to Level 2.
4. Continue to Level 5 and confirm wallet balance becomes exactly 500 coins.
5. Confirm reward history contains one successful reward entry and no expiration entry.

## Reset

1. Tap `Reset Test Data`.
2. Cancel the alert and confirm data remains unchanged.
3. Tap `Reset Test Data` again.
4. Confirm the alert and verify status returns to not started, level returns to Level 0, wallet balance returns to 0 coins, and reward history is empty.

## Persistence

1. Start the offer.
2. Play one or more levels.
3. Close and reopen Expo Go.
4. Confirm status, level, wallet balance, reward status, and reward history are restored.

## Reward Once

1. Reach Level 5.
2. Confirm wallet balance is 500 coins.
3. Tap `Play Next Level` if available or reopen the app.
4. Confirm wallet balance does not increase beyond 500 coins for the same offer.

## Deadline Logic Review

The app does not expose time controls. Deadline boundary checks should be reviewed in `src/rewardRules.ts`, where `evaluateReward`, `playNextLevel`, and `isWithinDeadline` accept the current time as an argument.
