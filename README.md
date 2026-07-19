# PlayReward QA Lab

A minimal Expo React Native TypeScript app for testing one rewarded-gaming offer flow on a physical Android phone with Expo Go.

## Scope

The app has one screen and one offer:

> Reach Level 5 within 7 days and earn 500 coins.

It lets a tester start the offer, play through levels, persist progress locally, grant the reward once when the rules are met, and reset local test data after confirmation.

## Run With Expo Go

Install dependencies first:

```powershell
npm install
```

Start the Expo development server:

```powershell
npm start
```

Then open Expo Go on a physical Android phone and scan the QR code shown by Expo.

## Continue on another laptop

```powershell
git clone <repository-url>
cd playreward-qa-lab
npm install
npm run lint
npx tsc --noEmit
npx expo start
```

## Validation Commands

```powershell
npm run lint
npm run typecheck
```

## Important Files

- `App.tsx` contains the single React Native screen.
- `src/rewardRules.ts` contains the offer deadline, level, wallet, and reward-granting rules.
- `src/storage.ts` saves and loads local progress with AsyncStorage.
- `docs/` contains the project purpose, business rules, user flow, app notes, manual test scenarios, learning journal, progress notes, and prompt record.

## TestIDs

Stable test IDs are included for:

- `Start Offer`
- `Play Next Level`
- `Reset Test Data`
- `Offer status`
- `Current level`
- `Wallet balance`
- `Reward history`
