# Prompt Record: Create Minimal App

## Complete Original Prompt And Approval Clarifications

```text
You are working in Cursor on Windows in workspace C:\Users\qunoot.ahmed\Documents\playreward-qa-lab. The user approved creating a new minimal Expo React Native TypeScript app for a rewarded-gaming QA lab portfolio.

Implement only the approved minimum scope. Do not add automation, APIs, ads, extra screens, Firebase, login, payments, Android Studio/Kotlin/Java/emulator work, CI/CD, or future features.

Requirements:
- Create a new React Native mobile application from the official Expo TypeScript starter template in the workspace.
- Must run through Expo Go on a physical Android phone.
- One simple screen only.
- Display one offer text: “Reach Level 5 within 7 days and earn 500 coins.”
- Let user start offer.
- Record start date/time.
- Starting offer sets level to 1.
- Provide “Play Next Level” button.
- Each valid press increases progress by exactly 1 level.
- Progress stops at Level 5.
- Reaching Level 5 within exact duration offerStartTime + 7 * 24 hours grants exactly 500 coins.
- Reaching exactly at deadline is valid. One millisecond after deadline is invalid.
- Reward can be granted only once.
- Save progress, start time, reward status, wallet balance, offer/activity status, and reward history locally using @react-native-async-storage/async-storage.
- Reward history should contain only successfully granted rewards.
- Unsuccessful expiration is recorded as offer/activity status, not reward history.
- Include confirmed “Reset Test Data” using React Native Alert.
- Add stable testIDs for interactive/status elements: Start Offer, Play Next Level, Reset Test Data, Offer status, Current level, Wallet balance, Reward history.
- Keep reward/deadline logic separate from UI where practical.
- Design deadline evaluation so current time can be supplied as an argument, not permanently tied to device clock.
- Do not add visible time manipulation or test-control buttons.

Required docs to create/maintain:
- README.md
- docs/01-project-purpose.md
- docs/02-business-rules.md
- docs/03-user-flow.md
- docs/04-how-the-app-works.md
- docs/05-manual-test-scenarios.md
- docs/06-learning-journal.md
- docs/07-project-progress.md
- docs/prompts/001-create-minimal-app.md

Save the user's complete original prompt plus the approval clarifications in docs/prompts/001-create-minimal-app.md.

Important workflow:
1. Inspect current workspace and avoid overwriting unrelated user changes. If workspace is not empty, handle carefully and report blockers if create-expo-app cannot safely run in place.
2. Create Expo TypeScript app using official starter/template. Use npm/npx as appropriate on Windows PowerShell.
3. Install @react-native-async-storage/async-storage with Expo install.
4. Implement the app and docs.
5. Run linting and TypeScript validation. If package scripts need adjustment, use official/appropriate commands. Record exact commands and results.
6. Start Expo development server in background at the end if possible, using a command suitable for Expo Go (e.g. npm start or npx expo start). Do not use Android emulator.

Return a concise user-visible final summary including:
- Actual lint/typecheck command results.
- Whether Expo dev server was started and command used.
- How to open with Expo Go on Android.
- Important files explained in plain language.
- Five initial manual checks.
- Any blockers or deviations.

Do not commit changes unless explicitly asked.
```

## Approval Clarifications Captured

- The user approved creating a new minimal Expo React Native TypeScript app.
- The app must stay within the approved minimum scope.
- Excluded items include automation, APIs, ads, extra screens, Firebase, login, payments, Android Studio/Kotlin/Java/emulator work, CI/CD, and future features.
