# Learning Journal

## What This Project Practices

- Creating a minimal Expo React Native app with TypeScript.
- Keeping UI code separate from business-rule code.
- Persisting mobile test state locally with AsyncStorage.
- Designing deadline logic so tests can supply a current time.
- Documenting manual QA scenarios for reward, persistence, expiration, and reset behavior.

## Notes

The app intentionally avoids services and platform-specific native work. That keeps the learning focus on React Native UI state, local storage, and reward-rule validation.

## Transfer Status

Application implementation is complete.

The project was moved to another laptop and run on a physical Android phone with Expo Go.

### Expo Go / SDK compatibility

On the previous laptop, the project resolved to Expo SDK 57 because `package.json` used `"expo": "latest"` (and related `"latest"` dependency ranges). That SDK was incompatible with the Expo Go version installed on the physical Android device, so the app could not open there.

### Migration to Expo SDK 54

Dependencies were aligned manually in VS Code to Expo SDK 54 and compatible package versions (pinned ranges instead of `latest`). Current declared versions in `package.json`:

- `expo`: `~54.0.0`
- `react`: `19.1.0`
- `react-native`: `0.81.5`
- `@react-native-async-storage/async-storage`: `2.2.0`

Resolved installed versions (from `package-lock.json` / `npm list`): `expo@54.0.36`, `react@19.1.0`, `react-native@0.81.5`.

### Android verification

After the SDK 54 alignment, the application opens successfully on the physical Android phone through Expo Go.
