# How The App Works

## Architecture

`App.tsx` owns loaded offer state, persistence side effects, and simple screen routing (`offers`, `details`, `game`, `completion`, `wallet`, `qaTools`). No navigation library is used.

Screens under `src/screens/` render UI only. They call handlers supplied by `App.tsx`.

## Business logic

`src/rewardRules.ts` owns:

- Offer start, deadline checks, reward grant (idempotent)
- Level unlock / completed-level tracking
- Attempt start, retry, treasure collection orchestration
- Simulate offer expiry via rewritten start timestamp + normal evaluation

`src/gameRules.ts` owns:

- 15-second attempt duration constant
- Treasures required per level
- Deterministic treasure position cycle and active treasure IDs

UI supplies `now` (or `new Date()`) into rule functions so deadline and attempt expiry are not hard-wired inside components.

## Persistence

`src/storage.ts` loads/saves AsyncStorage key `playreward-qa-lab:offer-state`.

`migrateOfferState` accepts Version 1 payloads missing Version 2 fields, applies defaults, maps legacy `currentLevel` into unlocked/completed semantics, and preserves wallet balance / rewardGranted when valid. Corrupt JSON falls back to `initialOfferState` instead of crashing.

## Treasure attempts

Attempts store absolute `attemptStartTime` and `attemptEndTime`. The game screen polls evaluation so backgrounding cannot extend available time. Failure sets `attemptFailed` without changing `completedLevels` or wallet data.

## Visual design

Shared tokens live in `src/theme.ts`. Shared controls (`AppButton`, `StatusBadge`, `ProgressBar`, `ScreenHeader`) live in `src/components/ui.tsx`. Visuals are code-drawn surfaces plus a simple emoji treasure marker (no copyrighted assets).
