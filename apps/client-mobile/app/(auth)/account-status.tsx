import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@shared/store';

function getStatusCopy(
  accountStatus: 'active' | 'paused' | 'deleted' | null,
  reason: string | null
): { title: string; message: string } {
  if (accountStatus === 'deleted') {
    return {
      title: 'Account unavailable',
      message:
        reason?.trim() ||
        'This account has been disabled. Contact 100Handy support if you believe this is a mistake.',
    };
  }

  return {
    title: 'Account paused',
    message:
      reason?.trim() ||
      'This account is temporarily paused. Contact 100Handy support for help restoring access.',
  };
}

export default function AccountStatusScreen() {
  const { accountStatus, accountStatusReason, signOut } = useAuthStore();
  const copy = getStatusCopy(accountStatus, accountStatusReason);

  return (
    <SafeAreaView className="flex-1 bg-[#30352D]">
      <View className="flex-1 px-6 py-10">
        <View className="flex-1 items-center justify-center">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-[#F3E7D9]/10">
            <AlertTriangle size={28} color="#F3E7D9" />
          </View>
          <Text className="mb-3 text-center font-worksans-semibold text-[28px] text-[#F3E7D9]">
            {copy.title}
          </Text>
          <Text className="max-w-[320px] text-center font-worksans text-[16px] leading-6 text-[#F3E7D9]/80">
            {copy.message}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            void signOut();
          }}
          className="flex-row items-center justify-center rounded-full bg-[#F3E7D9] px-6 py-4"
        >
          <LogOut size={18} color="#30352D" />
          <Text className="ml-2 font-worksans-semibold text-[16px] text-[#30352D]">
            Sign out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
