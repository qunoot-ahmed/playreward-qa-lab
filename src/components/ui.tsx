import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme';

type AppButtonProps = {
  testID: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

export function AppButton({
  testID,
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'ghost' && styles.ghostLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

type StatusBadgeProps = {
  testID?: string;
  label: string;
  tone?: 'neutral' | 'active' | 'success' | 'danger' | 'warning';
};

export function StatusBadge({ testID, label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.badge,
        tone === 'active' && styles.badgeActive,
        tone === 'success' && styles.badgeSuccess,
        tone === 'danger' && styles.badgeDanger,
        tone === 'warning' && styles.badgeWarning,
      ]}
    >
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

type ProgressBarProps = {
  testID: string;
  valueTestID: string;
  completed: number;
  total: number;
  label?: string;
};

export function ProgressBar({
  testID,
  valueTestID,
  completed,
  total,
  label,
}: ProgressBarProps) {
  const ratio = total <= 0 ? 0 : Math.min(1, Math.max(0, completed / total));

  return (
    <View testID={testID} style={styles.progressBlock}>
      {label ? <Text style={styles.progressLabel}>{label}</Text> : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text testID={valueTestID} style={styles.progressValue}>
        {completed}/{total}
      </Text>
    </View>
  );
}

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backTestID?: string;
  rightSlot?: ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backTestID = 'nav-back',
  rightSlot,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack ? (
          <Pressable testID={backTestID} onPress={onBack} accessibilityRole="button">
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        ) : null}
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: colors.brand,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  ghostLabel: {
    color: colors.text,
  },
  disabledLabel: {
    color: '#e2e8f0',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeActive: {
    backgroundColor: '#0c4a6e',
  },
  badgeSuccess: {
    backgroundColor: '#14532d',
  },
  badgeDanger: {
    backgroundColor: '#7f1d1d',
  },
  badgeWarning: {
    backgroundColor: '#78350f',
  },
  badgeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  progressBlock: {
    gap: spacing.sm,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressTrack: {
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.brand,
    height: '100%',
  },
  progressValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  backText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
