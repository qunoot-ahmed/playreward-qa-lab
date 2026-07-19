# User Flow

## Version 2 journey

1. Open the app in Expo Go (Expo SDK 54).
2. Land on **Offers**: see PlayReward branding, wallet balance, and the Treasure Quest offer card.
3. Tap **View Details**.
4. Tap **Start Offer** (only when not started). Confirm status becomes active and Level 1 is unlocked (progress 0/5).
5. Tap **Continue Playing** to enter Treasure Quest.
6. For the current level, tap the treasure target until the level requirement is met before the 15-second absolute deadline.
7. On failure, read **Level failed**, tap **Retry Level**, and try again without losing completed levels.
8. Complete Levels 1–5 within the 7-day offer deadline.
9. After Level 5 success, view the **Completion** result (congratulations, 500 coins, updated wallet), then **View Wallet**.
10. In **Wallet**, confirm balance and a single granted reward transaction.
11. Use main navigation to return to Offers. Completed offers show completed state; Start/Continue are unavailable.
12. Open **QA Tools** (test-only) to Reset Test Data or Simulate Offer Expiry when needed.

## Expired path

1. Start an offer (or use Simulate Offer Expiry in QA Tools).
2. Open Offer Details: expiration reason is visible; game actions blocked; no reward.

## Persistence path

1. Start an offer and begin a level attempt.
2. Background or close Expo Go before the attempt ends.
3. Reopen: remaining time follows the stored attempt-end timestamp (timer did not pause).
4. If the attempt already ended, the level is failed and retry is available; completed levels remain.
