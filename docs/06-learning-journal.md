# Learning Journal

## What This Project Practices

- Creating a minimal Expo React Native app with TypeScript.
- Keeping UI code separate from business-rule code.
- Persisting mobile test state locally with AsyncStorage.
- Designing deadline and attempt logic so tests can supply or derive time from absolute timestamps.
- Building a multi-area rewarded-gaming journey suitable for manual QA.
- Documenting manual QA scenarios for reward, persistence, expiration, failure/retry, and reset behavior.

## Why Version 1 Was Insufficient

Version 1 proved the core offer/reward rules on device, but it was only a functional prototype: one screen presented every concern, and “gameplay” was repeatedly pressing **Play Next Level**. That is too thin to demonstrate realistic rewarded-gaming QA (offer discovery, details, interactive challenge, wallet/history, isolated test tools).

## Version 1 Android verification (completed)

Version 1 was successfully run on a physical Android phone using Expo Go after aligning the project to Expo SDK 54.

### Expo Go / SDK compatibility

On the previous laptop, `"expo": "latest"` resolved toward Expo SDK 57, which was incompatible with the Expo Go build on the physical device. Dependencies were pinned to SDK 54 (`expo ~54.0.0`, `react 19.1.0`, `react-native 0.81.5`, AsyncStorage `2.2.0`) and the app opened successfully on Android through Expo Go.

## Version 2 decisions and reasons

| Decision | Reason |
| --- | --- |
| Fixed 15s attempt with absolute `attemptEndTime` | Prevents backgrounding/UI lag from extending play time |
| Track `currentLevel` (unlocked) and `completedLevels` separately | Matches offer progress semantics (0/5 until a level is finished) |
| Deterministic treasure position cycle | Keeps gameplay testable and targets on-screen |
| Simulate expiry by rewriting start time | Reuses real deadline evaluation; test-only and explicit |
| Minimal custom screen routing (no nav library) | Smallest maintainable solution on SDK 54 |
| QA Tools isolated from player path | Avoids confusing test actions with production UX |
| Safe V1 storage migration | Preserve wallet/reward when possible; never crash on missing fields |
| Stable non-dynamic testIDs | Support reliable manual/automation targeting later |

## Version 2 verification status

Version 2 was manually verified on a physical Android device through Expo Go.

## Notes

The app intentionally avoids backends, ads SDKs, auth, payments, automation frameworks, analytics, and performance tooling so the learning focus stays on mobile QA of offer rules, persistence, and interactive progress.
