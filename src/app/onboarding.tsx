import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../stores/onboarding-store';
import { colors } from '../theme/tokens';

const SLIDES = [
  {
    step: 'Cinéaste 01',
    title: 'Discover Movies\nYou’ll Love',
    description:
      'Explore curated cinema, trending releases, and hidden masterpieces tailored for discerning film lovers.',
    tag: 'Cannes Selection • 2024',
    rating: '9.4',
    curatorCut: 'Curator’s Cut',
    subheading: 'The Whispering Horizon',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCp3bn8w96uKjAynEzuUGa-JkjQ_YYTKmKvR2GrKJwcD5EH5-HcmeLBDls9ppjZ8sA0dKAtaWasPwvemmYEn4fqU60-qs7Y0WF6eaI9nPZo0ZAJLhApDFcFXPqhoG9n9YN446Bj47gvCw2oCfuI37qYwQB-kB6lUOxcddHinEqy2fXUP9ZN1pn8YjAO7kWxFho2slOZGtNx14DN_76W4p7KKRLJUo7sLQiJoskqrRhZGl91wg3VqvLv',
  },
  {
    step: 'Cinéaste 02',
    title: 'Save What\nCatches Your Eye',
    description:
      'Build your personal watchlist while you browse. Instant local persistence with zero login required.',
    tag: 'Instant Bookmark',
    rating: '8.8',
    curatorCut: 'Local-First Vault',
    subheading: 'Solaris Drift',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNBM_cmkdfRhb-TsDOBPEolN2QTZNK-Tc72QIiJrqvKJzoLJGGt8HkqTf64VnNlwlim39McsmmsLscrwamD1afTqOYmoe3Hg3LchYvVSD-BQ7ezjkgNjxKgp6uJfKWwtHd8gKJXvoRF5DqIp0ZKxQKsKNq1okWMZb5f-mNCJlMVFshjfEx7ljZoDw7a40Doi4CKPHlhBE1nop9QGTtFKhOOADTSDpgFSlFkBQ9QMmgr1up9TQbW00T',
  },
  {
    step: 'Cinéaste 03',
    title: 'Take Your Favorites\nAnywhere',
    description:
      'Create an account when you’re ready to synchronize your library across all devices, or continue freely as a guest.',
    tag: 'Cloud Sync Ready',
    rating: '8.9',
    curatorCut: 'Cross-Device Portability',
    subheading: 'Aperture Silence',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAV6qjzvXI-03dfKCZ7jbQPN3tuqgPcaVMDkeXrdYMTsAZ9XXt0qRkjNjz_KOf-rrRQ6NoOKMgsDS9R9MwQ6zDtE1f88brnICzACGOZdS5MYZt3V2s6RbkKjrcTxcd7PkjJ-10QTne2EBFjt-URLA5YTKLAGC9ANj-sT7RIYyzbityjOSTebh8hCAlU6KrgDwX6h9r68oFc0uLteMwpQwRO_7NYEg0aUTRMLGuSSO1xFyYA0ZsjSjsz',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/(tabs)' as any);
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await handleFinish();
    }
  };

  const handleSignIn = () => {
    completeOnboarding();
    router.replace('/(tabs)' as any);
    router.push('/auth' as any);
  };

  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Utility Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <Image
            source={require('../../assets/images/logo-emblem.png')}
            style={styles.brandIconBox}
            contentFit="contain"
            accessibilityLabel="AustinMovieBox Logo"
          />
          <Text style={styles.brandTitleText}>AustinMovieBox</Text>
          <Text style={styles.brandDotDivider}>•</Text>
          <Text style={styles.stepText}>{slide.step}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={handleFinish}
          style={({ pressed }) => [styles.skipButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Segmented Progress Bar */}
      <View style={styles.progressContainer}>
        {SLIDES.map((_, idx) => (
          <View
            key={idx}
            style={[styles.progressBar, idx <= currentIndex && styles.progressBarActive]}
          />
        ))}
      </View>

      {/* Hero Visual Stage */}
      <View style={styles.heroStage}>
        <Image
          source={{ uri: slide.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={400}
        />

        {/* Gradient Scrim */}
        <View style={styles.heroScrimTop} />
        <View style={styles.heroScrimBottom} />

        {/* Floating Tags inside Poster Realm */}
        <View style={styles.floatingContent}>
          <View style={styles.tagRow}>
            <View style={styles.festivalTag}>
              <View style={styles.pulseDot} />
              <Text style={styles.festivalTagText}>{slide.tag}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.cinemaAmber} />
              <Text style={styles.ratingText}>{slide.rating}</Text>
            </View>
          </View>

          <View style={styles.filmTitleOverlay}>
            <Text style={styles.curatorText}>{slide.curatorCut}</Text>
            <Text numberOfLines={1} style={styles.subheadingText}>
              {slide.subheading}
            </Text>
          </View>
        </View>
      </View>

      {/* Editorial Narrative Block */}
      <View style={styles.narrativeBlock}>
        <Text style={styles.headlineText}>{slide.title}</Text>
        <Text style={styles.descriptionText}>{slide.description}</Text>
      </View>

      {/* Interactive Controls */}
      <View style={styles.controlsBlock}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get Started' : 'Next slide'}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.primaryButton,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text style={styles.primaryButtonText}>{isLast ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.cinemaCanvas} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign in to existing vault"
          onPress={handleSignIn}
          style={({ pressed }) => [styles.secondaryLink, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.secondaryLinkText}>Sign in to existing vault</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 28,
    height: 28,
  },
  brandTitleText: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: 'Courier',
  },
  brandDotDivider: {
    color: colors.mutedInk,
    fontSize: 12,
  },
  stepText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    color: colors.secondaryInk,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.frameBorder,
    opacity: 0.5,
  },
  progressBarActive: {
    backgroundColor: colors.cinemaAmber,
    opacity: 1,
  },
  heroStage: {
    width: '100%',
    aspectRatio: 4 / 4.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(17, 18, 20, 0.4)',
  },
  heroScrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(17, 18, 20, 0.85)',
  },
  floatingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  festivalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 40, 44, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  festivalTagText: {
    color: colors.primaryInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Courier',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(27, 28, 30, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: colors.primaryInk,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  filmTitleOverlay: {
    marginTop: 2,
  },
  curatorText: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  subheadingText: {
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  narrativeBlock: {
    paddingVertical: 12,
  },
  headlineText: {
    color: colors.primaryInk,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  descriptionText: {
    color: colors.secondaryInk,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
  controlsBlock: {
    gap: 10,
    paddingTop: 8,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.cinemaCanvas,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryLink: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  secondaryLinkText: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
});
