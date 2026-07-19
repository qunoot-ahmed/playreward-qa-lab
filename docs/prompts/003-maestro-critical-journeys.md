# Prompt Record: Maestro Critical Journeys

## Complete Original Prompt

```text
I want to add a minimal Maestro mobile automation suite to PlayReward.

The objective is to demonstrate that the critical and high-risk rewarded-gaming
journeys are automated. I do not want a complicated framework or excessive
test coverage.

Do not add Jest, Appium, API tests, performance tests, CI/CD, reporting
libraries, or additional application features.

Before changing files:

1. Inspect the current PlayReward application and its testID values.
2. Confirm that Expo SDK 54 remains unchanged.
3. Inspect app.json and confirm whether the stable Android package ID
   com.qunoot.playreward is configured.
4. Determine whether all elements needed by Maestro have stable testID values.
5. Propose the smallest required application changes, if any.
6. Explain how an installable APK will be created using Expo EAS cloud build
   without Android Studio.
7. Propose the Maestro files and assertions.
8. Wait for my approval before modifying anything.

AUTOMATION SCOPE

Create only these four Maestro flows:

1. Rewarded offer happy path
2. Level failure and retry
3. Expired offer protection
4. Persistence and duplicate reward protection

STRUCTURE

Create only:

maestro/
  flows/
    01-rewarded-offer-happy-path.yaml
    02-level-failure-and-retry.yaml
    03-expired-offer-protection.yaml
    04-persistence-and-duplicate-reward.yaml
  subflows/
    reset-test-data.yaml
  README.md

(+ approved addition: complete-treasure-quest.yaml)

DOCUMENTATION / PRINCIPLES

(as in the planning prompt: stable IDs, reset isolation, no reward-rule changes,
no claimed pass without APK execution, Expo SDK 54 unchanged)
```

## Approval Decisions (recorded)

1. **Package ID** — permanently change `com.playrewardqalab.app` → `com.qunoot.playreward`. Do not change Expo SDK 54.
2. **QA Tools confirmation** — replace system alerts with in-app panels and testIDs:
   `confirm-reset-test-data`, `cancel-reset-test-data`,
   `confirm-simulate-offer-expiry`, `cancel-simulate-offer-expiry`.
3. **Reward transaction count** — visible `Transactions: N` from `rewardHistory.length` with testID `reward-transaction-count`.
4. **Reusable completion subflow** — add `maestro/subflows/complete-treasure-quest.yaml` with level-boundary comments; avoid duplicating the 15-tap sequence.
5. **Assertion expectations** — as specified for happy path, failure/retry, expiry, and persistence flows.
6. **APK configuration** — add minimal `eas.json` preview APK profile; do not log into Expo or start EAS builds in implementation.
7. **Implementation checkpoints** — apply app/Maestro/docs changes, run TypeScript/lint, optionally validate Maestro YAML structure, stop before EAS login / APK build / install / Maestro execution.

## Implementation Notes

- Expo SDK 54 pins were left unchanged.
- Maestro execution against the APK was not performed in the implementation session.
- Owner must run `eas login`, `eas build -p android --profile preview`, install the APK, then run `maestro test`.
