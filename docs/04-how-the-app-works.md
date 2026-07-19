# How The App Works

`App.tsx` renders the one-screen experience. It displays the offer, status, current level, wallet balance, reward history, and three actions: start, play next level, and reset test data.

`src/rewardRules.ts` contains the business logic. The UI supplies the current time as an argument when it starts the offer, progresses levels, or evaluates whether a saved active offer has expired. This keeps deadline evaluation from being permanently tied to the device clock.

`src/storage.ts` uses `@react-native-async-storage/async-storage` to save and load:

- Offer/activity status.
- Current level.
- Offer start date/time.
- Reward granted flag.
- Wallet balance.
- Reward history.

The reset action uses a React Native `Alert` confirmation before clearing local storage and returning the app to the initial state.
