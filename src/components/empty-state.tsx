import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  iconName = 'film-outline',
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={colors.cinemaAmber} />
      </View>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
      {actionLabel && onActionPress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.actionButton,
            { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  titleText: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    color: colors.secondaryInk,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  actionButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.cinemaCanvas,
    fontSize: 14,
    fontWeight: '700',
  },
});
