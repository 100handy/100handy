import React, { useEffect } from 'react';
import { ScrollView, Image, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CreditCard,
  Smile,
  HandCoins,
  Calendar,
  MapPin,
  Bell,
  Mail,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingTask } from '@/components/dashboard';
import { useAuthStore } from '@shared/supabase';
import { useProfileStore } from '@shared/supabase';

export default function ProfessionalDashboard() {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const onboardingTasks = [
    {
      icon: <CreditCard color="#D17852" size={28} strokeWidth={1.5} />,
      title: '100 Handy Support',
      duration: '4 MIN PER SKILL',
      onPress: () => {
        // TODO: Navigate to support screen
      },
    },
    {
      icon: <Smile color="#D17852" size={28} strokeWidth={1.5} />,
      title: 'Upload a profile photo',
      duration: '2 MIN',
      onPress: () => {
        router.push('/(professional)/add-profile-photo');
      },
    },
    {
      icon: <HandCoins color="#D17852" size={28} strokeWidth={1.5} />,
      title: 'Set your hourly rate',
      duration: '2 MIN',
      onPress: () => {
        // TODO: Navigate to hourly rate screen
      },
    },
    {
      icon: <Calendar color="#D17852" size={28} strokeWidth={1.5} />,
      title: 'Set availability',
      duration: '4 MIN',
      onPress: () => {
        router.push('/(professional)/set-availability');
      },
    },
    {
      icon: <MapPin color="#D17852" size={28} strokeWidth={1.5} />,
      title: 'Set work area',
      duration: '4 MIN',
      onPress: () => {
        router.push('/(professional)/set-work-area');
      },
    },
  ];
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="bg-[#4A5347]">
        <LinearGradient
          colors={['#4A5347', '#3D4239']}
          style={{paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16}}
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
                  <View className="w-full h-full items-center justify-center bg-[#D17852]/30">
                    <Text className="font-worksans-bold text-2xl text-white">
                      {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="font-worksans-semibold text-white text-[26px]">
                Hello, {profile?.first_name || 'Professional'}
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
      >
        <View className="flex-col px-5 pt-5 pb-3">
          <Text className="font-worksans-bold text-[18px] text-[#30352D] mb-2.5">
            Onboarding progress (0/5)
          </Text>
          <View className="h-[3px] bg-[#E5E5E5] rounded-full overflow-hidden">
            <View className="h-full w-0 bg-[#E67A3D]" />
          </View>
        </View>

        <View className="flex-col">
          {onboardingTasks.map((task, index) => (
            <OnboardingTask
              key={index}
              icon={task.icon}
              title={task.title}
              duration={task.duration}
              onPress={task.onPress}
            />
          ))}
        </View>

        <Pressable className="mx-5 mt-8 mb-6 bg-[#A8B89E] rounded-2xl p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-start space-x-3 flex-1">
              <AlertTriangle color="#30352D" size={26} strokeWidth={2} />
              <View className="flex-col flex-1">
                <Text className="font-worksans-bold text-[16px] text-[#30352D] mb-1">
                  Your account isn't live yet!
                </Text>
                <Text className="font-worksans text-[11px] text-[#333a31] leading-[15px]">
                  Tap here to verify your identity and activate your account.
                </Text>
              </View>
            </View>
            <ChevronRight color="#30352D" size={22} strokeWidth={2} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}