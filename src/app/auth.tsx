import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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
import { colors } from '../theme/tokens';

export default function AuthModalScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    signIn,
    signUp,
    signInWithGoogle,
    continueAsGuest,
    isLoading,
    error: storeError,
    clearError,
  } = useAuthStore();

  const displayError = localError || storeError;

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const handleSubmit = async () => {
    setLocalError(null);
    if (!email.trim() || !password) {
      setLocalError('Please provide both an email address and archive passcode.');
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setLocalError('Archive passcode must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Archive passcodes do not match.');
        return;
      }

      const res = await signUp(email.trim(), password);
      if (res.success) {
        if (res.needsEmailConfirmation) {
          setLocalError('Check your email to confirm your account, then sign in.');
          return;
        }
        router.replace('/(tabs)');
      }
    } else {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        router.replace('/(tabs)');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    if (storeError) clearError();
    const res = await signInWithGoogle(email ? email.trim() : undefined);
    if (res.success) {
      if (Platform.OS !== 'web') {
        router.replace('/(tabs)');
      }
    }
  };

  const handleGuestContinue = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
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
            accessibilityLabel="Close modal"
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color={colors.primaryInk} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Editorial Form Card */}
          <View style={styles.formCard}>
            {/* Ambient Cinema Amber Glow */}
            <View style={styles.ambientGlow} />

            {/* Editorial Brand Mark */}
            <View style={styles.brandMarkRow}>
              <View style={styles.brandMark}>
                <Image
                  source={require('../../assets/images/logo-emblem.png')}
                  style={styles.brandLogoImage}
                  contentFit="contain"
                  accessibilityLabel="AustinMovieBox Logo"
                />
                <Text style={styles.brandTitleText}>AustinMovieBox</Text>
              </View>

              <View style={styles.memberPassBadge}>
                <Ionicons name="ticket-outline" size={13} color={colors.cinemaAmber} />
                <Text style={styles.memberPassText}>MEMBER PASS</Text>
              </View>
            </View>

            {/* Header & Supportive Copy */}
            <View style={styles.headerBlock}>
              <Text style={styles.headerTitle}>
                {isSignUp ? 'Create Member Vault' : 'Welcome back'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isSignUp
                  ? 'Register to unlock your personal film vault and synchronize your curated collection.'
                  : 'Sign in to access your synchronized film collection across all your devices.'}
              </Text>
            </View>

            {/* Form Inputs */}
            <View style={styles.formInputs}>
              {/* Email Address */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <Text style={styles.requiredText}>REQUIRED</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={colors.mutedInk} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (localError) setLocalError(null);
                      if (storeError) clearError();
                    }}
                    placeholder="curator@cine.gallery"
                    placeholderTextColor={colors.mutedInk}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                    selectionColor={colors.cinemaAmber}
                  />
                </View>
              </View>

              {/* Archive Passcode / Password */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Archive Passcode</Text>
                  {isSignUp ? (
                    <Text style={styles.requiredText}>MIN 6 CHARACTERS</Text>
                  ) : (
                    <Text style={styles.forgotLink}>REQUIRED</Text>
                  )}
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.mutedInk} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (localError) setLocalError(null);
                      if (storeError) clearError();
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

                {/* Password Strength Indicator (Sign Up Only) */}
                {isSignUp && password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBarsRow}>
                      {[1, 2, 3, 4].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.strengthBar,
                            strengthScore >= level && styles.strengthBarActive,
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.strengthLabel}>
                      {strengthScore <= 1 ? 'Basic key' : strengthScore <= 3 ? 'Good passcode' : 'Strong vault key'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Passcode (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Confirm Passcode</Text>
                    {confirmPassword.length > 0 && confirmPassword === password && (
                      <Text style={styles.matchText}>PASSCODE MATCHES</Text>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="shield-checkmark-outline" size={18} color={colors.mutedInk} style={styles.inputIcon} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (localError) setLocalError(null);
                      }}
                      placeholder="Re-enter your archive passcode"
                      placeholderTextColor={colors.mutedInk}
                      secureTextEntry={!showPassword}
                      style={styles.textInput}
                      selectionColor={colors.cinemaAmber}
                    />
                  </View>
                </View>
              )}

              {/* Automatic Migration Guarantee Card (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.migrationCard}>
                  <View style={styles.migrationIconWrap}>
                    <Ionicons name="shield-checkmark" size={18} color={colors.cinemaAmber} />
                  </View>
                  <View style={styles.migrationContent}>
                    <Text style={styles.migrationTitle}>Automatic Migration</Text>
                    <Text style={styles.migrationText}>
                      Your cached watchlists and curated reviews will seamlessly bridge without data loss.
                    </Text>
                  </View>
                </View>
              )}

              {/* Validation / Error Banner */}
              {displayError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={18} color={colors.cinemaAmber} />
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              ) : null}

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
                      {isSignUp ? 'Create account' : 'Sign in to Collection'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.cinemaCanvas} />
                  </>
                )}
              </Pressable>
            </View>

            {/* Visual Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SYNC OR PREVIEW</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Social Connect Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              disabled={isLoading}
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [
                styles.googleButton,
                { opacity: pressed || isLoading ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
              ]}
            >
              <View style={styles.googleIconCircle}>
                <Ionicons name="logo-google" size={16} color={colors.cinemaAmber} />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            {/* Switch between Sign In / Sign Up */}
            <View style={styles.switchRow}>
              <Text style={styles.switchQuestion}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setLocalError(null);
                  if (storeError) clearError();
                }}
              >
                <Text style={styles.switchAction}>
                  {isSignUp ? 'Sign in' : 'Create account'}
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
              Browse curated lists without cloud sync
            </Text>
          </View>

          {/* Editorial Footer Note */}
          <View style={styles.footerRow}>
            <View style={styles.footerLeft}>
              <Ionicons name="shield-outline" size={13} color={colors.mutedInk} />
              <Text style={styles.footerText}>256-BIT ENCRYPTED VAULT</Text>
            </View>
            <Text style={styles.footerText}>AustinMovieBox v2.4.0</Text>
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
    gap: 8,
  },
  brandLogoImage: {
    width: 24,
    height: 24,
  },
  brandTitleText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    marginBottom: 20,
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
  forgotLink: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  matchText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginRight: 12,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(53, 56, 60, 0.6)',
  },
  strengthBarActive: {
    backgroundColor: colors.cinemaAmber,
  },
  strengthLabel: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  migrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 29, 32, 0.8)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
    gap: 12,
    marginTop: 2,
  },
  migrationIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(215, 163, 91, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  migrationContent: {
    flex: 1,
  },
  migrationTitle: {
    color: colors.primaryInk,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  migrationText: {
    color: colors.mutedInk,
    fontSize: 11,
    lineHeight: 15,
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
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: colors.cinemaCanvas,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.quietStage,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.7)',
    borderRadius: 14,
    height: 48,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(215, 163, 91, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  switchQuestion: {
    color: colors.secondaryInk,
    fontSize: 13,
  },
  switchAction: {
    color: colors.cinemaAmber,
    fontSize: 13,
    fontWeight: '700',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    marginTop: 4,
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
    marginTop: 20,
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
