export const LEVEL_ATTEMPT_DURATION_MS = 15_000;
export const MAX_LEVEL = 5;

/** Treasures required to complete each playable level (index = level number). */
export const TREASURES_REQUIRED: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

/**
 * Fixed safe positions as fractions of the playable game area (0–1).
 * Kept clear of edges so targets stay fully visible and away from chrome.
 */
export const TREASURE_POSITIONS: readonly { x: number; y: number }[] = [
  { x: 0.18, y: 0.22 },
  { x: 0.68, y: 0.28 },
  { x: 0.42, y: 0.48 },
  { x: 0.22, y: 0.68 },
  { x: 0.72, y: 0.62 },
  { x: 0.48, y: 0.18 },
  { x: 0.28, y: 0.42 },
  { x: 0.62, y: 0.78 },
];

export function getTreasuresRequired(level: number): number {
  return TREASURES_REQUIRED[level] ?? 0;
}

/**
 * Deterministic position cycle. Each level starts at a different offset;
 * subsequent collections advance through the fixed list.
 */
export function getTreasurePositionIndex(level: number, collectedCount: number): number {
  const offset = Math.max(0, level - 1) % TREASURE_POSITIONS.length;
  return (offset + collectedCount) % TREASURE_POSITIONS.length;
}

export function getTreasurePosition(level: number, collectedCount: number): { x: number; y: number } {
  return TREASURE_POSITIONS[getTreasurePositionIndex(level, collectedCount)];
}

/** Stable identity for the currently collectible target (blocks double-count taps). */
export function getActiveTreasureId(level: number, collectedCount: number): string {
  return `treasure-${level}-${collectedCount}`;
}

export function getRemainingAttemptMs(attemptEndTime: string, now: Date): number {
  return Math.max(0, new Date(attemptEndTime).getTime() - now.getTime());
}

export function isAttemptExpired(attemptEndTime: string, now: Date): boolean {
  return now.getTime() > new Date(attemptEndTime).getTime();
}
