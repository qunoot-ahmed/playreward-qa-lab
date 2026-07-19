# Business Rules

## Offer

The only offer text is:

> Reach Level 5 within 7 days and earn 500 coins.

## Start

- Before starting, the offer status is `not_started`.
- Starting the offer records the current date and time.
- Starting the offer sets the current level to Level 1.
- The offer status becomes `active`.

## Progress

- `Play Next Level` is valid only while the offer is active and before the deadline.
- Each valid press increases progress by exactly 1 level.
- Progress stops at Level 5.

## Deadline

- The deadline is exactly `offerStartTime + 7 * 24 hours`.
- Reaching Level 5 at the exact deadline is valid.
- Reaching Level 5 one millisecond after the deadline is invalid.

## Reward

- Reaching Level 5 within the deadline grants exactly 500 coins.
- The reward can be granted only once.
- Reward history contains only successfully granted rewards.
- Expiration without reward is recorded as offer status, not as reward history.

## Local Data

The app saves progress, start time, reward status, wallet balance, offer status, and reward history locally with AsyncStorage.
