import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/auth-store';
import { useFavoritesStore } from '../stores/favorites-store';
import { colors } from '../theme/tokens';

export default function AuthModalScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithYouTube,
    continueAsGuest,
    isLoading,
    error,
    clearError,
  } = useAuthStore();
  const syncWithCloud = useFavoritesStore((state) => state.syncWithCloud);

  const handleSubmit = async () => {
    if (!email || !password) return;

    if (isSignUp) {
      const res = await signUp(email.trim(), password);
      if (res.success) {
        const user = useAuthStore.getState().user;
        if (user) {
          await syncWithCloud(user.id);
        }
        router.back();
      }
    } else {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        const user = useAuthStore.getState().user;
        if (user) {
          await syncWithCloud(user.id);
        }
        router.back();
      }
    }
  };

  const handleYouTubeSignIn = async () => {
    if (error) clearError();
    const res = await signInWithYouTube(email ? email.trim() : undefined);
    if (res.success) {
      const user = useAuthStore.getState().user;
      if (user) {
        await syncWithCloud(user.id);
      }
      router.back();
    }
  };

  const handleGoogleSignIn = async () => {
    if (error) clearError();
    const res = await signInWithGoogle(email ? email.trim() : undefined);
    if (res.success) {
      const user = useAuthStore.getState().user;
      if (user) {
        await syncWithCloud(user.id);
      }
      router.back();
    }
  };

  const handleGuestContinue = async () => {
    await continueAsGuest();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Top Close Bar */}
        <View style={styles.topCloseBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close auth modal"
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color={colors.primaryInk} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Card */}
          <View style={styles.formCard}>
            {/* Ambient Background Glow */}
            <View style={styles.ambientGlow} />

            {/* Editorial Brand Mark */}
            <View style={styles.brandMarkRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandDot} />
                <Text style={styles.brandCine}>AUSTIN</Text>
                <Text style={styles.brandArchive}>MOVIEBOX</Text>
              </View>

              <View style={styles.memberPassBadge}>
                <Ionicons name="ticket-outline" size={13} color={colors.cinemaAmber} />
                <Text style={styles.memberPassText}>THEATRICAL PASS</Text>
              </View>
            </View>

            {/* Header & Supportive Copy */}
            <View style={styles.headerBlock}>
              <Text style={styles.headerTitle}>
                {isSignUp ? 'Create Member Vault' : 'Theatrical Access'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isSignUp
                  ? 'Register to unlock unrestricted official film trailers and synchronize your curated collection.'
                  : 'Sign in to access HD theatrical trailers and synchronize your saved watchlist.'}
              </Text>
            </View>

            {/* Theatrical Video Requirement Banner */}
            <View style={styles.requirementBanner}>
              <View style={styles.requirementHeader}>
                <View style={styles.youtubeIconBadge}>
                  <Ionicons name="logo-youtube" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.requirementTitle}>VIDEO WATCH REQUIREMENT</Text>
              </View>
              <Text style={styles.requirementText}>
                Official movie trailers and age-restricted theatrical previews require an active{' '}
                <Text style={styles.highlightText}>YouTube</Text> or{' '}
                <Text style={styles.highlightText}>Google / Gmail</Text> account. Connect below for uninterrupted streaming.
              </Text>
            </View>

            {/* Dedicated YouTube & Google Streaming Login Buttons */}
            <View style={styles.socialButtonsGroup}>
              {/* YouTube Sign In Button */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign in with YouTube"
                disabled={isLoading}
                onPress={handleYouTubeSignIn}
                style={({ pressed }) => [
                  styles.youtubeButton,
                  { opacity: pressed || isLoading ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
                ]}
              >
                <View style={styles.socialButtonLeft}>
                  <View style={styles.youtubeRedCircle}>
                    <Ionicons name="logo-youtube" size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.socialTextGroup}>
                    <Text style={styles.youtubeButtonText}>Continue with YouTube</Text>
                    <Text style={styles.socialSubtext}>Unlocks all theatrical trailer streams</Text>
                  </View>
                </View>
                <View style={styles.socialRightBadge}>
                  <Text style={styles.socialRightBadgeText}>STREAM READY</Text>
                </View>
              </Pressable>

              {/* Google / Gmail Sign In Button */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continue with Google or Gmail"
                disabled={isLoading}
                onPress={handleGoogleSignIn}
                style={({ pressed }) => [
                  styles.googleButton,
                  { opacity: pressed || isLoading ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
                ]}
              >
                <View style={styles.socialButtonLeft}>
                  <View style={styles.googleCircle}>
                    <Ionicons name="logo-google" size={17} color={colors.cinemaAmber} />
                  </View>
                  <View style={styles.socialTextGroup}>
                    <Text style={styles.googleButtonText}>Continue with Google / Gmail</Text>
                    <Text style={styles.socialSubtext}>Connect via your Google account</Text>
                  </View>
                </View>
                <View style={styles.googleRightBadge}>
                  <Text style={styles.googleRightBadgeText}>VERIFIED GMAIL</Text>
                </View>
              </Pressable>
            </View>

            {/* Visual Divider to Passcode Form */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR WITH ARCHIVE PASSCODE</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Form Inputs (Alternative Email / Passcode Login) */}
            <View style={styles.formInputs}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <Text style={styles.requiredText}>OPTIONAL FOR YOUTUBE</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={colors.mutedInk} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (error) clearError();
                    }}
                    placeholder="curator@gmail.com"
                    placeholderTextColor={colors.mutedInk}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                    selectionColor={colors.cinemaAmber}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Archive Passcode</Text>
                  <Text style={styles.requiredText}>
                    {isSignUp ? 'MIN 6 CHARS' : 'PASSCODE'}
                  </Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.mutedInk} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (error) clearError();
                    }}
                    placeholder="Enter your archive passcode"
                    placeholderTextColor={colors.mutedInk}
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                    selectionColor={colors.cinemaAmber}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.mutedInk}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Validation / Error Banner */}
              {error && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={18} color={colors.cinemaAmber} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Primary Submit Button */}
              <Pressable
                accessibilityRole="button"
                disabled={isLoading}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitBtn,
                  { opacity: pressed || isLoading ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.cinemaCanvas} />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>
                      {isSignUp ? 'Create Member Vault' : 'Sign in to Collection'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.cinemaCanvas} />
                  </>
                )}
              </Pressable>
            </View>

            {/* Switch between Sign In / Sign Up */}
            <View style={styles.switchRow}>
              <Text style={styles.switchQuestion}>
                {isSignUp ? 'Already have an archive account?' : 'Need a separate archive pass?'}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  if (error) clearError();
                }}
              >
                <Text style={styles.switchAction}>
                  {isSignUp ? 'Sign In' : 'Create account'}
                </Text>
              </Pressable>
            </View>

            {/* Escape Route / Continue as Guest */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue as guest explorer"
              onPress={handleGuestContinue}
              style={({ pressed }) => [styles.guestBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="compass-outline" size={18} color={colors.secondaryInk} />
              <Text style={styles.guestBtnText}>Continue as guest explorer</Text>
            </Pressable>
            <Text style={styles.guestSubtext}>
              Browse catalog without cloud sync (Trailers may prompt for YouTube sign-in)
            </Text>
          </View>

          {/* Editorial Footer Note */}
          <View style={styles.footerRow}>
            <View style={styles.footerLeft}>
              <Ionicons name="shield-outline" size={13} color={colors.mutedInk} />
              <Text style={styles.footerText}>256-BIT ENCRYPTED VAULT</Text>
            </View>
            <Text style={styles.footerText}>v1.0.0 AUSTIN MOVIEBOX</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
  },
  keyboardView: {
    flex: 1,
  },
  topCloseBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: colors.raisedStage,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(215, 163, 91, 0.08)',
  },
  brandMarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cinemaAmber,
  },
  brandCine: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: 'Courier',
  },
  brandArchive: {
    color: colors.mutedInk,
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: 'Courier',
  },
  memberPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  memberPassText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  headerBlock: {
    marginBottom: 18,
  },
  headerTitle: {
    color: colors.primaryInk,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  headerSubtitle: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 18,
  },
  requirementBanner: {
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.25)',
    marginBottom: 20,
    gap: 6,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  youtubeIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementTitle: {
    color: '#FF4D4D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  requirementText: {
    color: colors.primaryInk,
    fontSize: 12,
    lineHeight: 17,
  },
  highlightText: {
    color: colors.cinemaAmber,
    fontWeight: '700',
  },
  socialButtonsGroup: {
    gap: 12,
    marginBottom: 18,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1517',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 0, 0, 0.45)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.quietStage,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.8)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  socialButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  youtubeRedCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 197, 24, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
  },
  socialTextGroup: {
    flex: 1,
  },
  youtubeButtonText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  googleButtonText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  socialSubtext: {
    color: colors.secondaryInk,
    fontSize: 11,
    marginTop: 2,
  },
  socialRightBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  socialRightBadgeText: {
    color: '#FF6B6B',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Courier',
    letterSpacing: 0.6,
  },
  googleRightBadge: {
    backgroundColor: 'rgba(245, 197, 24, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
  },
  googleRightBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Courier',
    letterSpacing: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(53, 56, 60, 0.4)',
  },
  dividerText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  formInputs: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '600',
  },
  requiredText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.quietStage,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: colors.primaryInk,
    fontSize: 14,
  },
  eyeBtn: {
    padding: 6,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(37, 40, 44, 0.9)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cinemaAmber,
  },
  errorText: {
    flex: 1,
    color: colors.secondaryInk,
    fontSize: 12,
    lineHeight: 16,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: colors.cinemaCanvas,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    marginBottom: 12,
  },
  switchQuestion: {
    color: colors.secondaryInk,
    fontSize: 12,
  },
  switchAction: {
    color: colors.cinemaAmber,
    fontSize: 12,
    fontWeight: '700',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
  },
  guestBtnText: {
    color: colors.secondaryInk,
    fontSize: 13,
    fontWeight: '600',
  },
  guestSubtext: {
    color: colors.mutedInk,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Courier',
    marginTop: 2,
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'Courier',
    letterSpacing: 0.6,
  },
});
