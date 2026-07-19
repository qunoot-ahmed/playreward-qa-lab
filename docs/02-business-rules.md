# Business Rules

## Offer

Game name: **Treasure Quest**

Offer text:

> Complete Treasure Quest Level 5 within 7 days and earn 500 coins.

Reward: exactly **500 coins** when Level 5 is completed within the deadline.

## Level model

“Current level” means the level currently available to play.

- Starting the offer unlocks Level 1 (`completedLevels = 0`).
- Completing Level N unlocks Level N+1 and increments `completedLevels`.
- Completing Level 5 completes the offer (`completedLevels = 5`).

Offer Details progress bar uses **completed levels out of 5**:

| State | Progress |
| --- | --- |
| Not started | 0/5 |
| Level 1 unlocked, not completed | 0/5 |
| Level 3 unlocked | 2/5 |
| Offer completed | 5/5 |

## Start

- Before starting, status is `not_started`.
- Starting records `offerStartTime`, sets status `active`, unlocks Level 1.
- A completed (`rewarded`) offer cannot be restarted.

## Treasure Quest attempts

Each level uses a fixed **15-second** attempt window based on an absolute `attemptEndTime` (not a pauseable UI-only counter).

| Level | Treasures required |
| --- | --- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 5 |

Rules:

- The user advances a level only after collecting that level’s full target before `attemptEndTime`.
- Treasure positions follow a fixed deterministic cycle (safe in-area coordinates).
- A single rendered target is collectible only once (`treasure-{level}-{collectedIndex}`).
- Rapid taps must not double-count, skip levels, or grant duplicate rewards.
- On timer expiry: show failure, do not advance level, do not change wallet/history; Retry starts a new 15s attempt from zero collected treasures.
- Completed-level progress is never lost after failure or app restart.

Persisted attempt fields:

- current unlocked level
- collected treasure count
- attempt start timestamp
- attempt end timestamp
- attempt failed flag

Backgrounding does not pause or extend the attempt. Remaining time is derived from `attemptEndTime`.

## Deadline

- Deadline = `offerStartTime + 7 * 24 hours`.
- Completing Level 5 at the exact deadline is valid.
- Completing after the deadline grants no reward; status becomes `expired`.
- Expired offers: details viewable; game actions blocked; no reward.

## Reward

- Completing Level 5 within the deadline grants exactly 500 coins once.
- Granting is idempotent (`rewardGranted` + status `rewarded`).
- Reward history stores successful grants only (game name, offer text, amount, timestamp, status `granted`).
- Expiration is status-only and never appears as a reward transaction.

## QA Tools (test-only)

- **Reset Test Data** — confirmed clear of local state.
- **Simulate Offer Expiry** — rewrites `offerStartTime` to slightly more than seven days in the past, then runs normal `evaluateReward` / deadline logic. Does not bypass business rules.

## Local data

AsyncStorage persists offer status, levels, attempt fields, wallet balance, reward flag, and history. Version 1 saves are migrated with defaults for new fields; wallet balance and reward status are preserved when valid.
