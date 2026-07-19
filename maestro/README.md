# Maestro Mobile Automation

This folder holds a **small** Maestro suite for PlayReward QA Lab. It automates only the critical and high-risk rewarded-gaming journeys. It is not a full regression pack.

Application ID (permanent Android package):

```text
com.qunoot.playreward
```

Expo SDK stays on **54**. These flows target a **standalone APK** built with Expo EAS — not Expo Go.

## Why these four journeys?

| Flow | Why it matters |
| --- | --- |
| Happy path | Proves the full reward journey grants exactly 500 coins once |
| Failure and retry | Proves a timed failure does not advance progress or grant coins |
| Expired offer | Proves deadline protection blocks play and blocks rewards |
| Persistence / duplicate | Proves restart keeps completion and never double-pays |

## Prerequisites

1. A physical Android phone (or emulator) with USB debugging enabled.
2. [Maestro CLI](https://maestro.mobile.dev/) installed on your computer.
3. An installable PlayReward **APK** for `com.qunoot.playreward` (see below).
4. The APK installed on the device.

## APK installation requirement

Maestro must drive the real app package `com.qunoot.playreward`.

Expo Go uses a different package, so **Expo Go is not a valid Maestro target** for this suite.

### Build an APK with Expo EAS (no Android Studio)

Run these yourself (this project does not log into Expo or start builds for you):

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The `preview` profile in `eas.json` requests an Android **APK**.

When the cloud build finishes:

1. Download the APK from the Expo build page / CLI link.
2. Install it on the phone, for example:

```powershell
adb install -r path\to\playreward.apk
```

## How to connect an Android device

1. Enable Developer options and USB debugging on the phone.
2. Connect USB and accept the debugging prompt.
3. Confirm the device is visible:

```powershell
adb devices
```

4. Confirm the app package is installed:

```powershell
adb shell pm list packages | findstr qunoot
```

You should see `package:com.qunoot.playreward`.

## How to run one flow

From the repo root:

```powershell
maestro test maestro/flows/01-rewarded-offer-happy-path.yaml
```

Other flows:

```powershell
maestro test maestro/flows/02-level-failure-and-retry.yaml
maestro test maestro/flows/03-expired-offer-protection.yaml
maestro test maestro/flows/04-persistence-and-duplicate-reward.yaml
```

## How to run all flows

```powershell
maestro test maestro/flows/
```

## Expected results

- Each flow starts by resetting local test data (shared subflow).
- Happy path ends with completion UI, wallet **500 coins**, and **Transactions: 1**.
- Failure flow shows **Level failed**, keeps progress **0/5** and wallet **0**, then reaches **1/5** after a successful retry.
- Expiry flow shows **Expired**, hides Continue Playing, keeps wallet **0** and **Transactions: 0**.
- Persistence flow relaunches without clearing storage and still shows Completed, **5/5**, **500 coins**, **Transactions: 1**, with Start/Continue unavailable.

Do not treat flows as “passed” until you have run them against the installed APK and seen Maestro report success.

## Test-data isolation

- Every independent flow runs `maestro/subflows/reset-test-data.yaml` first.
- Reset uses the in-app QA confirmation (`confirm-reset-test-data`), not a system alert.
- Persistence relaunches with `clearState: false` so AsyncStorage is kept on purpose.

## Known limitations

- Flows are not claimed executed in CI from this repo setup.
- Treasure completion depends on timely taps within each 15-second attempt.
- Device performance or overlays can still flake UI automation.
- Screen navigation state is in memory; after relaunch the app opens on Offers while offer data is restored from storage.

## Which scenarios remain manual

- Exact offer-deadline millisecond boundary review in code
- Visual polish / layout on varied device sizes
- Accessibility beyond basic labels used here
- Network, ads, payments, accounts (out of product scope)
- Performance / battery / long soak testing

## Files

```text
maestro/
  flows/
    01-rewarded-offer-happy-path.yaml
    02-level-failure-and-retry.yaml
    03-expired-offer-protection.yaml
    04-persistence-and-duplicate-reward.yaml
  subflows/
    reset-test-data.yaml
    complete-treasure-quest.yaml
  README.md
```
