import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ExternalLink } from 'lucide-react-native';
import { buildReferralDeepLink, ensureReferralCode } from '@shared/supabase';

export default function PromoteYourselfScreen() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReferral(): Promise<void> {
      setIsLoading(true);
      const code = await ensureReferralCode();
      if (isMounted) {
        setReferralCode(code);
        setIsLoading(false);
      }
    }

    loadReferral();

    return () => {
      isMounted = false;
    };
  }, []);

  const referralLink = useMemo(() => {
    if (!referralCode) return null;
    return buildReferralDeepLink(referralCode);
  }, [referralCode]);

  const handleShare = useCallback(async (): Promise<void> => {
    if (!referralLink || !referralCode) return;

    const message =
      `Give clients $10 off their next task.\n\n` +
      `Referral code: ${referralCode}\n` +
      `Sign up here: ${referralLink}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [referralCode, referralLink]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#000000" />
        </Pressable>
        <Text className="flex-1 text-center text-2xl font-worksans-bold text-[#333A31] pr-8">
          Promote Yourself
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Referral code */}
        <View className="mb-10">
          <Text className="text-3xl font-worksans-bold text-[#333A31] tracking-wider">
            {isLoading ? ' ' : referralCode || '—'}
          </Text>
          <Text className="text-base font-worksans text-[#333A31]/70 mt-2">
            Give clients $10 off their next task
          </Text>
        </View>

        {/* Link row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 min-w-0">
            <Text className="text-2xl font-worksans-bold text-[#333A31]">
              {referralLink || (isLoading ? '' : 'Link unavailable')}
            </Text>
            <Text className="text-base font-worksans text-[#333A31]/70 mt-1">
              Link clients to your profile
            </Text>
          </View>

          <Pressable
            className="ml-4 w-12 h-12 items-center justify-center"
            onPress={handleShare}
            disabled={!referralLink || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0F766E" />
            ) : (
              <ExternalLink size={22} color="#0F766E" />
            )}
          </Pressable>
        </View>

        {/* Tap hint */}
        <Pressable
          className="mt-6 self-start"
          onPress={handleShare}
          disabled={!referralLink || isLoading}
        >
          <Text className="text-sm font-worksans-medium text-[#0F766E]">
            Tap to share
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


