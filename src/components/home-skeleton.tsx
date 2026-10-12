import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

export function HomeSkeleton() {
  const [pulseAnim] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Section 1: Editorial Header / Status Pill */}
      <View style={styles.headerStatusRow}>
        <View style={styles.statusLeft}>
          <View style={styles.cineBadge}>
            <View style={styles.liveAmberDot} />
            <Text style={styles.cineBadgeText}>CINÉ ARCHIVE</Text>
          </View>
          <Text style={styles.reelTag}>/ 35MM REEL</Text>
        </View>

        <View style={styles.fetchingBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.fetchingText}>FETCHING ARCHIVE...</Text>
        </View>
      </View>

      {/* Discover Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.headlineText}>Discover</Text>
        <Text style={styles.subtitleText}>
          Curated theatrical selections & archival retrospectives
        </Text>
      </View>

      {/* Section 2: Hero Spotlight Skeleton (16:9) */}
      <View style={styles.heroCard}>
        <Animated.View style={[styles.heroBackdropSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.heroGradientScrim} />
          <View style={styles.heroContentPlaceholder}>
            {/* Eyebrow Pill */}
            <View style={styles.eyebrowPill} />
            {/* Title Bar */}
            <View style={styles.heroTitleBar} />
            {/* Metadata Row */}
            <View style={styles.metaRow}>
              <View style={[styles.metaChip, { width: 44 }]} />
              <View style={[styles.metaChip, { width: 56 }]} />
              <View style={[styles.metaChip, { width: 72 }]} />
            </View>
          </View>
        </Animated.View>

        {/* Spotlight CTA Button Skeleton */}
        <Animated.View style={[styles.ctaButtonSkeleton, { opacity: pulseAnim }]}>
          <View style={styles.playDot} />
          <View style={styles.ctaTextBar} />
        </Animated.View>
      </View>

      {/* Section 3: Trending Reels Rail Skeleton */}
      <View style={styles.railBlock}>
        <View style={styles.railHeaderRow}>
          <View style={styles.railTitleRow}>
            <View style={styles.railAccentLine} />
            <Text style={styles.railTitle}>Trending Reels</Text>
          </View>
          <View style={[styles.seeAllPlaceholder, { opacity: pulseAnim as any }]} />
        </View>

        <View style={styles.railCardsRow}>
          {[1, 2, 3, 4].map((item) => (
            <Animated.View key={item} style={[styles.posterCard, { opacity: pulseAnim }]}>
              <View style={styles.posterImage} />
              <View style={styles.cardTitleBar} />
              <View style={styles.cardSubBar} />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Section 4: Popular Premieres Rail Skeleton */}
      <View style={styles.railBlock}>
        <View style={styles.railHeaderRow}>
          <View style={styles.railTitleRow}>
            <View style={styles.railAccentLine} />
            <Text style={styles.railTitle}>Popular Premieres</Text>
          </View>
          <View style={[styles.seeAllPlaceholder, { opacity: pulseAnim as any }]} />
        </View>

        <View style={styles.railCardsRow}>
          {[1, 2, 3, 4].map((item) => (
            <Animated.View key={item} style={[styles.posterCard, { opacity: pulseAnim }]}>
              <View style={styles.posterImage} />
              <View style={styles.cardTitleBar} />
              <View style={styles.cardSubBar} />
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quietStage,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveAmberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
    marginRight: 6,
  },
  cineBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  reelTag: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
  },
  fetchingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.raisedStage,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
    marginRight: 6,
  },
  fetchingText: {
    color: colors.secondaryInk,
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
    letterSpacing: 0.5,
  },
  titleBlock: {
    marginBottom: 16,
  },
  headlineText: {
    color: colors.primaryInk,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: colors.mutedInk,
    fontSize: 13,
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    padding: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  heroBackdropSkeleton: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: colors.quietStage,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 14,
  },
  heroGradientScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 18, 20, 0.4)',
  },
  heroContentPlaceholder: {
    gap: 8,
    zIndex: 1,
  },
  eyebrowPill: {
    width: 100,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.raisedStage,
  },
  heroTitleBar: {
    width: '70%',
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.raisedStage,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  metaChip: {
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.raisedStage,
  },
  ctaButtonSkeleton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(215, 163, 91, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  playDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.cinemaAmber,
    opacity: 0.6,
  },
  ctaTextBar: {
    width: 110,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.cinemaAmber,
    opacity: 0.6,
  },
  railBlock: {
    marginBottom: 24,
  },
  railHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  railTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  railAccentLine: {
    width: 3,
    height: 16,
    backgroundColor: colors.cinemaAmber,
    borderRadius: 2,
  },
  railTitle: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAllPlaceholder: {
    width: 48,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.quietStage,
  },
  railCardsRow: {
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
  },
  posterCard: {
    width: 130,
    gap: 6,
  },
  posterImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: colors.quietStage,
  },
  cardTitleBar: {
    width: '85%',
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.quietStage,
  },
  cardSubBar: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.quietStage,
  },
});
