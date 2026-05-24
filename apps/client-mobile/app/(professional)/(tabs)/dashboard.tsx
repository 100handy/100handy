import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { ScrollView, View, Text, Pressable, Alert, RefreshControl, Image } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { router } from 'expo-router'; import {   DollarSign, Landmark, Smile, Calendar, MapPin, Bell, Mail, AlertTriangle, ChevronRight, ShieldCheck, Clock, } from 'lucide-react-native'; import { LinearGradient } from 'expo-linear-gradient'; import { OnboardingTask } from '@/components/dashboard'; import { useAuthStore } from '@shared/store';
import { useProfileStore } from '@shared/store';
import { supabase } from '@shared/supabase';
import { useWeeklyAvailability } from '@shared/query';
import { getHandyProfile, getUserSkills } from '@shared/supabase/profile'; import { getConnectAccountStatus } from '@shared/supabase/payment-methods'; import { useWorkArea } from '@shared/query';
import { useFocusEffect } from 'expo-router';
import { getUnsupportedNativeFeatureMessage, presentStripeIdentityVerificationSheet, supportsStripeNative } from '@/lib/native-feature-support';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.greeting_prefix': 'Hello,',
  'progress.label_prefix': 'Onboarding progress',
  'progress.loading': 'Loading your progress...',
  'tasks.verify_identity': 'Verify your identity',
  'tasks.name_price': 'Name your price',
  'tasks.direct_deposit': 'Set up direct deposit',
  'tasks.profile_photo': 'Upload a profile photo',
  'tasks.availability': 'Set availability',
  'tasks.work_area': 'Set work area',
  'alerts.verification_in_progress_title': 'Verification In Progress',
  'alerts.verification_in_progress_body': 'Your identity verification is already being reviewed. Please wait.',
  'alerts.verification_received_title': 'Verification received',
  'alerts.verification_received_body': 'Stripe finished the verification flow. Your status will update after the backend confirms the result.',
  'alerts.verification_failed_title': 'Verification Failed',
  'alerts.verification_failed_body': 'Please try again.',
  'alerts.verification_error_title': 'Error',
  'alerts.verification_error_body': 'Failed to start verification. Please try again.',
  'banner.verified_title': 'Account Verified',
  'banner.verified_body': 'Your identity has been verified. You can now receive bookings.',
  'banner.submitted_title': 'Verification In Progress',
  'banner.submitted_body': 'Your identity verification is being reviewed. This usually takes a few minutes.',
  'banner.rejected_title': 'Verification Failed',
  'banner.rejected_body': 'Tap here to try again with clear photos of your ID.',
  'banner.default_title': "Your account isn't live yet!",
  'banner.default_body': 'Tap here to verify your identity and activate your account.',
  'banner.starting': 'Starting verification...',
  'misc.professional_fallback_name': 'Professional',
} as const;

type VerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected' | null;

export default function ProfessionalDashboard() {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasActiveSkill, setHasActiveSkill] = useState(false);
  const [hasAnySkill, setHasAnySkill] = useState(false);
  const [hasDirectDeposit, setHasDirectDeposit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const hasHandledInitialFocusRef = useRef(false);
  const content = useAppContent('professional_dashboard', DEFAULT_CONTENT);

  // Fetch work area and availability for progress calculation
  const { data: workArea } = useWorkArea();
  const { data: weeklyAvailability } = useWeeklyAvailability();

  // Calculate completed onboarding tasks (6 total: verification + 5 setup tasks)
  const totalTasks = 6;
  const completedTasks = useMemo(() => {
    let count = 0;
    if (verificationStatus === 'verified') count++;                             // 1. ID verification (required first)
    if (hasActiveSkill) count++;                                                 // 2. Name your price (skill activated)
    if (hasDirectDeposit) count++;                                               // 3. Direct deposit
    if (profile?.avatar_url) count++;                                           // 4. Profile photo
    if (weeklyAvailability && Object.keys(weeklyAvailability).length > 0) count++; // 5. Availability set
    if (workArea?.coordinates && workArea.coordinates.length >= 3) count++;     // 6. Work area set
    return count;
  }, [profile?.avatar_url, verificationStatus, workArea, weeklyAvailability, hasActiveSkill, hasDirectDeposit]);

  const progressPercent = (completedTasks / totalTasks) * 100;
  const isLoadingOverview = !hasLoadedProgress && !refreshing;

  // Fetch skills and direct deposit status
  const fetchOnboardingProgress = useCallback(async () => {
    try {
      // Check for active skills (has at least 1 skill with is_active=true and hourly_rate_cents > 0)
      const skills = await getUserSkills();
      setHasAnySkill(skills.length > 0);
      const activeSkills = skills.filter(s => s.is_active && s.hourly_rate_cents > 0);
      setHasActiveSkill(activeSkills.length > 0);

      // Check for direct deposit setup (Stripe Connect payouts enabled)
      const connectStatus = await getConnectAccountStatus();
      setHasDirectDeposit(connectStatus?.payoutsEnabled ?? false);
    } catch (error) {
      console.warn('Unable to fetch onboarding progress:', error);
    } finally {
      setHasLoadedProgress(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchVerificationStatus();
      fetchOnboardingProgress();
    }
  }, [user, fetchProfile, fetchOnboardingProgress]);

  // Refresh progress + verification status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!hasHandledInitialFocusRef.current) {
        hasHandledInitialFocusRef.current = true;
        return undefined;
      }

      if (user) {
        fetchVerificationStatus();
        fetchOnboardingProgress();
      }
    }, [user, fetchOnboardingProgress])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchVerificationStatus(),
        fetchOnboardingProgress(),
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      const handyProfile = await getHandyProfile();
      if (handyProfile?.verification_status) {
        setVerificationStatus(handyProfile.verification_status as VerificationStatus);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const fetchOptions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.functions.invoke('create-verification-session', {
        body: {
          userId: user.id,
          email: user.email,
        },
      });

      if (error) {
        throw error;
      }

      return {
        sessionId: data.id,
        ephemeralKeySecret: data.ephemeral_key_secret,
        brandLogo: Image.resolveAssetSource(require('@/assets/images/icon.png')),
      };
    } catch (e: any) {
      Alert.alert('Error', e.message);
      throw e;
    }
  }, []);

  const [stripeLoading, setStripeLoading] = useState(false);

  const handleStartVerification = useCallback(async () => {
    // Don't start a new verification if already submitted or verified
    if (verificationStatus === 'submitted') {
      Alert.alert(
        getAppContentValue(content, 'alerts.verification_in_progress_title', DEFAULT_CONTENT['alerts.verification_in_progress_title']),
        getAppContentValue(content, 'alerts.verification_in_progress_body', DEFAULT_CONTENT['alerts.verification_in_progress_body'])
      );
      return;
    }
    if (verificationStatus === 'verified') {
      return;
    }

    if (!supportsStripeNative()) {
      Alert.alert('Unavailable in Expo Go', getUnsupportedNativeFeatureMessage('Identity verification'));
      return;
    }

    try {
      setIsVerifying(true);
      setStripeLoading(true);
      const options = await fetchOptions();
      const result = await presentStripeIdentityVerificationSheet(options);

      if (result?.status === 'FlowCompleted') {
        await fetchVerificationStatus();
        Alert.alert(
          getAppContentValue(content, 'alerts.verification_received_title', DEFAULT_CONTENT['alerts.verification_received_title']),
          getAppContentValue(content, 'alerts.verification_received_body', DEFAULT_CONTENT['alerts.verification_received_body'])
        );
      } else if (result?.status === 'FlowFailed') {
        Alert.alert(
          getAppContentValue(content, 'alerts.verification_failed_title', DEFAULT_CONTENT['alerts.verification_failed_title']),
          getAppContentValue(content, 'alerts.verification_failed_body', DEFAULT_CONTENT['alerts.verification_failed_body'])
        );
      }
    } catch (error) {
      console.error('Error in verification:', error);
      Alert.alert(
        getAppContentValue(content, 'alerts.verification_error_title', DEFAULT_CONTENT['alerts.verification_error_title']),
        getAppContentValue(content, 'alerts.verification_error_body', DEFAULT_CONTENT['alerts.verification_error_body'])
      );
    } finally {
      setStripeLoading(false);
      setIsVerifying(false);
    }
  }, [fetchOptions, fetchVerificationStatus, verificationStatus]);

  // Check completion status for each task
  const hasProfilePhoto = !!profile?.avatar_url;
  const hasAvailability = weeklyAvailability && Object.keys(weeklyAvailability).length > 0;
  const hasWorkArea = workArea?.coordinates && workArea.coordinates.length >= 3;

  const isAccountVerified = verificationStatus === 'verified';

  const isVerificationSubmitted = verificationStatus === 'submitted';

  const onboardingTasks = [
    {
      icon: <ShieldCheck color={isAccountVerified ? "#6B7B6B" : isVerificationSubmitted ? "#856404" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.verify_identity', DEFAULT_CONTENT['tasks.verify_identity']),
      duration: isVerificationSubmitted ? 'Under review' : '5 MIN',
      completed: isAccountVerified,
      disabled: false,
      onPress: () => {
        if (!isAccountVerified) {
          handleStartVerification();
        }
      },
    },
    {
      icon: <DollarSign color={hasActiveSkill ? "#6B7B6B" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.name_price', DEFAULT_CONTENT['tasks.name_price']),
      duration: '4 MIN PER SKILL',
      completed: hasActiveSkill,
      disabled: false,
      onPress: () => {
        router.push(hasAnySkill ? '/(professional)/skills/my-skills' : '/(professional)/skills/add-skills');
      },
    },
    {
      icon: <Landmark color={hasDirectDeposit ? "#6B7B6B" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.direct_deposit', DEFAULT_CONTENT['tasks.direct_deposit']),
      duration: '2 MIN',
      completed: hasDirectDeposit,
      disabled: false,
      onPress: () => {
        router.push('/(professional)/profile/direct-deposit');
      },
    },
    {
      icon: <Smile color={hasProfilePhoto ? "#6B7B6B" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.profile_photo', DEFAULT_CONTENT['tasks.profile_photo']),
      duration: '2 MIN',
      completed: hasProfilePhoto,
      disabled: false, // Photo upload doesn't require verification
      onPress: () => {
        router.push('/(professional)/add-profile-photo');
      },
    },
    {
      icon: <Calendar color={hasAvailability ? "#6B7B6B" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.availability', DEFAULT_CONTENT['tasks.availability']),
      duration: '4 MIN',
      completed: hasAvailability,
      disabled: false,
      onPress: () => {
        router.push('/(professional)/(tabs)/bookings');
      },
    },
    {
      icon: <MapPin color={hasWorkArea ? "#6B7B6B" : "#C1856A"} size={28} strokeWidth={1.5} />,
      title: getAppContentValue(content, 'tasks.work_area', DEFAULT_CONTENT['tasks.work_area']),
      duration: '4 MIN',
      completed: hasWorkArea,
      disabled: false,
      onPress: () => {
        router.push('/(professional)/(tabs)/work-area');
      },
    },
  ];

  // Render verification banner based on status
  const renderVerificationBanner = () => {
    // Already verified - show success banner
    if (verificationStatus === 'verified') {
      return (
        <View className="mx-5 mt-8 mb-6 bg-[#D4EDDA] rounded-2xl p-4">
          <View className="flex-row items-center space-x-3">
            <ShieldCheck color="#155724" size={26} strokeWidth={2} />
            <View className="flex-col flex-1 ml-3">
              <Text className="font-worksans-bold text-[16px] text-[#155724]">
                {getAppContentValue(content, 'banner.verified_title', DEFAULT_CONTENT['banner.verified_title'])}
              </Text>
              <Text className="font-worksans text-[11px] text-[#155724] leading-[15px]">
                {getAppContentValue(content, 'banner.verified_body', DEFAULT_CONTENT['banner.verified_body'])}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Verification submitted - pending review
    if (verificationStatus === 'submitted') {
      return (
        <View className="mx-5 mt-8 mb-6 bg-[#FFF3CD] rounded-2xl p-4">
          <View className="flex-row items-center space-x-3">
            <Clock color="#856404" size={26} strokeWidth={2} />
            <View className="flex-col flex-1 ml-3">
              <Text className="font-worksans-bold text-[16px] text-[#856404]">
                {getAppContentValue(content, 'banner.submitted_title', DEFAULT_CONTENT['banner.submitted_title'])}
              </Text>
              <Text className="font-worksans text-[11px] text-[#856404] leading-[15px]">
                {getAppContentValue(content, 'banner.submitted_body', DEFAULT_CONTENT['banner.submitted_body'])}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Verification rejected - allow retry
    if (verificationStatus === 'rejected') {
      return (
        <Pressable
          className="mx-5 mt-8 mb-6 bg-[#F8D7DA] rounded-2xl p-4"
          onPress={handleStartVerification}
          disabled={isVerifying || stripeLoading}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-start space-x-3 flex-1">
              <AlertTriangle color="#721C24" size={26} strokeWidth={2} />
              <View className="flex-col flex-1 ml-3">
                <Text className="font-worksans-bold text-[16px] text-[#721C24] mb-1">
                  {getAppContentValue(content, 'banner.rejected_title', DEFAULT_CONTENT['banner.rejected_title'])}
                </Text>
                <Text className="font-worksans text-[11px] text-[#721C24] leading-[15px]">
                  {isVerifying
                    ? getAppContentValue(content, 'banner.starting', DEFAULT_CONTENT['banner.starting'])
                    : getAppContentValue(content, 'banner.rejected_body', DEFAULT_CONTENT['banner.rejected_body'])}
                </Text>
              </View>
            </View>
            <ChevronRight color="#721C24" size={22} strokeWidth={2} />
          </View>
        </Pressable>
      );
    }

    // Default: pending or null - show verification needed banner
    return (
      <Pressable
        className="mx-5 mt-8 mb-6 bg-[#A8B89E] rounded-2xl p-4"
        onPress={handleStartVerification}
        disabled={isVerifying || stripeLoading}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-start space-x-3 flex-1">
            <AlertTriangle color="#30352D" size={26} strokeWidth={2} />
            <View className="flex-col flex-1 ml-3">
              <Text className="font-worksans-bold text-[16px] text-brand-dark-alt mb-1">
                {getAppContentValue(content, 'banner.default_title', DEFAULT_CONTENT['banner.default_title'])}
              </Text>
              <Text className="font-worksans text-[11px] text-brand-dark leading-[15px]">
                {isVerifying
                  ? getAppContentValue(content, 'banner.starting', DEFAULT_CONTENT['banner.starting'])
                  : getAppContentValue(content, 'banner.default_body', DEFAULT_CONTENT['banner.default_body'])}
              </Text>
            </View>
          </View>
          <ChevronRight color="#30352D" size={22} strokeWidth={2} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-[#4A5347]">
        <LinearGradient
          colors={['#4A5347', '#3D4239']}
          style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-[62px] h-[62px] rounded-full overflow-hidden bg-gray-300">
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-full h-full"
                    style={{ width: 62, height: 62 }}
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-brand-terracotta/30">
                    <Text className="font-worksans-bold text-2xl text-white">
                      {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="font-worksans-semibold text-white text-[26px]">
                {getAppContentValue(content, 'header.greeting_prefix', DEFAULT_CONTENT['header.greeting_prefix'])} {profile?.first_name || getAppContentValue(content, 'misc.professional_fallback_name', DEFAULT_CONTENT['misc.professional_fallback_name'])}
              </Text>
            </View>

            <View className="flex-row items-center gap-4">
              <Pressable onPress={() => router.push('/(professional)/announcements')}>
                <Bell color="white" size={26} strokeWidth={1.5} />
              </Pressable>
              <Pressable onPress={() => router.push('/(professional)/inbox')}>
                <Mail color="white" size={26} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C1856A" />
        }
      >
        <View className="flex-col px-5 pt-5 pb-3">
          <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mb-2.5">
            {getAppContentValue(content, 'progress.label_prefix', DEFAULT_CONTENT['progress.label_prefix'])} ({completedTasks}/{totalTasks})
          </Text>
          <View className="h-[3px] bg-[#E5E5E5] rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-500"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          {isLoadingOverview ? (
            <Text className="font-worksans text-[12px] text-[#6B6B6B] mt-2">
              {getAppContentValue(content, 'progress.loading', DEFAULT_CONTENT['progress.loading'])}
            </Text>
          ) : null}
        </View>

        <View className="flex-col">
          {onboardingTasks.map((task, index) => (
            <OnboardingTask
              key={index}
              icon={task.icon}
              title={task.title}
              duration={task.duration}
              completed={task.completed}
              disabled={task.disabled}
              onPress={task.onPress}
            />
          ))}
        </View>

        {renderVerificationBanner()}
      </ScrollView>
    </SafeAreaView>
  );
}
