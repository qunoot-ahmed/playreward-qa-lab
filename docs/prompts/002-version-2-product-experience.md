# Prompt Record: Version 2 Product Experience

## Complete Original Prompt And Approval Clarifications

```text
The current PlayReward application now runs successfully on a physical Android
phone through Expo Go using Expo SDK 54.

The current implementation is only a functional prototype. It presents all
information on one screen, and gameplay consists only of pressing
“Play Next Level” repeatedly.

I want to create Version 2: a small but believable rewarded-gaming QA lab.

The objective is not to build an extensive commercial game. The objective is
to create a realistic mobile system under test through which I can learn and
demonstrate rewarded-gaming QA.

Before changing code:

1. Inspect the current repository and documentation.
2. Preserve Expo SDK 54 and all compatible dependencies.
3. Review the current business rules and implementation.
4. Explain the proposed Version 2 design and affected files.
5. Identify new or changed business rules.
6. Wait for my approval.

VERSION 2 PRODUCT

The fictional game is named “Treasure Quest.”

The offer is:

“Complete Treasure Quest Level 5 within 7 days and earn 500 coins.”

Create these application areas:

1. Offers
2. Offer Details
3. Treasure Quest
4. Wallet
5. QA Tools

Navigation may be implemented simply without adding a heavy navigation
library unless one is genuinely required and explained first.

OFFERS AREA

Display:

- PlayReward branding
- Wallet balance in the header
- Treasure Quest offer card
- Reward: 500 coins
- Target: Level 5
- Deadline: 7 days
- Current offer status
- View Details button
- Simple visual styling appropriate for a mobile gaming/rewards application

OFFER DETAILS

Display:

- Game name
- Offer description
- Reward amount
- Requirement
- Offer status
- Start date
- Deadline or time remaining
- Current level
- Level progress bar
- Start Offer button before starting
- Continue Playing button after starting
- Completed state after successful completion

TREASURE QUEST GAME

Replace the “Play Next Level” button with a small interactive challenge.

For every level, the user must find and tap a treasure target before a visible
timer expires.

Level requirements:

- Level 1: collect 1 treasure
- Level 2: collect 2 treasures
- Level 3: collect 3 treasures
- Level 4: collect 4 treasures
- Level 5: collect 5 treasures

Requirements:

- The treasure target should change position after a successful tap.
- Display current level, collected treasures, target, and remaining time.
- The user advances only after completing the level requirement.
- If time expires, show a clear failure state.
- Failed levels may be retried.
- Failure must not incorrectly increase progress.
- Progress must persist after closing and reopening the app.
- The implementation must remain deterministic and testable where practical.
- Do not add complex graphics, physics, audio, external game engines, or
  unnecessary dependencies.

REWARD RULES

- Completing Level 5 within seven days grants exactly 500 coins.
- Completion exactly at the deadline remains valid.
- Completion after the deadline grants no reward.
- Reward granting must be idempotent.
- Rapid or repeated interactions must never grant duplicate coins.
- Wallet balance and reward history must remain consistent.
- A completed offer cannot be restarted or rewarded again.

COMPLETION EXPERIENCE

After successful Level 5 completion, show a completion result containing:

- Congratulations message
- Treasure Quest Level 5 completed
- 500 coins earned
- Updated wallet balance
- View Wallet action

WALLET

Display:

- Total coin balance
- Reward transaction history
- Offer/game name
- Reward amount
- Completion timestamp
- Transaction status

QA TOOLS

Move Reset Test Data away from the normal player journey into a clearly
labelled QA Tools area.

For this phase, QA Tools should contain only:

- Reset Test Data with confirmation
- Simulate Offer Expiry with confirmation

Clearly label QA Tools as test-only functionality, not a production feature.

UI EXPECTATIONS

- Create a polished but simple gaming/rewards visual design.
- Use consistent colors, spacing, cards, typography, button states, and status
  indicators.
- Support the physical Android screen correctly without clipped content.
- Use ScrollView where required.
- Provide visible feedback for loading, success, failure, disabled, active,
  expired, and completed states.
- Preserve accessibility.
- Add stable testID values to all important elements.
- Do not use copyrighted game images or assets.
- Use simple code-created visuals, emoji, or openly licensed assets only if
  attribution requirements are documented.

DOCUMENTATION

Update:

- README.md
- docs/02-business-rules.md
- docs/03-user-flow.md
- docs/04-how-the-app-works.md
- docs/05-manual-test-scenarios.md
- docs/06-learning-journal.md
- docs/07-project-progress.md

Create:

- docs/prompts/002-version-2-product-experience.md

Save this complete prompt in the new prompt document.

Document:

- Why Version 1 was insufficient
- New user journey
- New and changed business rules
- Treasure Quest level rules
- Reward decision flow
- Manual test considerations
- Known limitations
- Actual verification results

IMPLEMENTATION RULES

- Do not upgrade Expo SDK 54.
- Do not add backend APIs, authentication, advertisements, payments, Firebase,
  Appium, Maestro, analytics services, or performance testing.
- Do not remove existing local persistence or reward safeguards.
- Do not claim device verification unless I perform it.
- Keep business logic separated from visual components.
- Implement the smallest maintainable solution.
- Run TypeScript validation and any configured linting after implementation.

Approval clarifications:

1. TIMER — fixed 15-second timer; absolute attempt-end timestamp; no pause/extend on background.
2. LEVEL DEFINITION — current level = unlocked playable level; track completed levels; Offer Details progress = completed/5.
3. LEVEL REQUIREMENTS — Level N requires N treasures; advance only when complete before attempt deadline.
4. INCOMPLETE ATTEMPT PERSISTENCE — persist unlocked level, collected count, attempt start/end; reopen after deadline => failed + retry; never lose completed levels.
5. TREASURE POSITIONS — fixed deterministic safe cycle; logic outside visual component where practical.
6. SIMULATE OFFER EXPIRY — rewrite offer start to slightly more than seven days past; evaluate via normal rules; test-only.
7. PROGRESS DISPLAY — Details overall completed/5; Game collected/target; completed 5/5; not started 0/5.
8. EXPIRED AND COMPLETED ACCESS — details viewable; game blocked; clear messaging; no re-reward/restart.
9. NAVIGATION — Offers, Wallet, QA Tools; Details/Game/Completion via journey + back; no nav dependency.
10. FAILURE AND RETRY — Level failed; no advance/wallet/history; Retry from zero with new 15s timer.
11. RAPID TAP PROTECTION — one collect per target id; no double count/skip/duplicate rewards.
12. V1 DATA MIGRATION — safe defaults; preserve wallet/reward when valid; explain before reset if impossible.
13. TEST IDENTIFIERS — stable IDs for listed controls; not derived from changing screen text.
14. DOCUMENTATION — record decisions/reasons; journal must state V1 Android success on SDK 54; do not claim V2 device verification until owner performs it.
```

## Implementation Notes

- Implemented with Expo SDK 54 pins unchanged and no navigation library.
- V1 storage migration applied defaults; no forced reset required.
- Version 2 physical-device verification left to the project owner until performed; owner later confirmed Version 2 on a physical Android device through Expo Go.
