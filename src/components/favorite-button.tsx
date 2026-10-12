import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/auth-store';
import { useFavoritesStore } from '../stores/favorites-store';
import { colors } from '../theme/tokens';
import { Movie } from '../types';

interface FavoriteButtonProps {
  movie: Movie;
  size?: number;
  iconSize?: number;
  variant?: 'floating' | 'solid';
}

export function FavoriteButton({
  movie,
  size = 44,
  iconSize = 20,
  variant = 'floating',
}: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) =>
    movie?.id && typeof state?.isFavorite === 'function' ? state.isFavorite(movie.id) : false
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const user = useAuthStore((state) => state.user);

  const handlePress = (e: any) => {
    e?.stopPropagation?.();
    if (movie && typeof toggleFavorite === 'function') {
      toggleFavorite(movie, user?.id);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor:
            variant === 'floating' ? 'rgba(27, 29, 32, 0.85)' : colors.quietStage,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
      ]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={isFavorite ? colors.cinemaAmber : colors.secondaryInk}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
