import React from 'react';
import { StatusBar, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Briefcase, ArrowRight } from 'lucide-react-native';
import TaskHelperLogo from '../../assets/images/task-helper-logo.svg';

export default function AuthRoleSelectionScreen() {
  const router = useRouter();
  

  const handleClientAuth = (): void => {
    router.push('/(auth)/(client)');
  };

  const handleProfessionalAuth = (): void => {
    router.push('/(auth)/(professional)/sign-up');
  };

  return (
    <SafeAreaView className="flex-1 bg-theme-background">
      <StatusBar barStyle="dark-content" />
      <View className="flex-col flex-1 justify-center items-center p-6">
        {/* Logo and Title */}
        <View className="flex-col items-center mb-12">
          <View className="w-20 h-20 bg-white rounded-2xl shadow-lg justify-center items-center mb-4">
            <TaskHelperLogo width={40} height={40} />
          </View>
          <Text className="font-worksans-bold text-2xl text-typography-900 mb-2">
            100Handy
          </Text>
          <Text className="font-worksans text-center text-typography-600 text-base">
            Choose how you'd like to use the app
          </Text>
        </View>

        {/* Role Selection Cards */}
        <View className="flex-col w-full space-y-4 mb-8">
          {/* Client Role */}
          <Pressable
            className="bg-white border border-outline-200 rounded-2xl p-6 shadow-sm"
            onPress={handleClientAuth}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-sage-green rounded-xl justify-center items-center mr-4">
                  <User color="white" size={24} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-worksans-bold text-typography-900 text-lg mb-1">
                    I need help
                  </Text>
                  <Text className="font-worksans text-typography-600 text-sm">
                    Find professionals for home tasks
                  </Text>
                </View>
              </View>
              <ArrowRight color="#666" size={20} />
            </View>
          </Pressable>

          {/* Professional Role */}
          <Pressable
            className="bg-white border border-outline-200 rounded-2xl p-6 shadow-sm"
            onPress={handleProfessionalAuth}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-clay-orange rounded-xl justify-center items-center mr-4">
                  <Briefcase color="white" size={24} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-worksans-bold text-typography-900 text-lg mb-1">
                    I provide services
                  </Text>
                  <Text className="font-worksans text-typography-600 text-sm">
                    Earn money by helping others
                  </Text>
                </View>
              </View>
              <ArrowRight color="#666" size={20} />
            </View>
          </Pressable>
        </View>

        {/* Help Text */}
        <View className="flex-col w-full items-center">
          <Text className="font-worksans text-center text-xs text-typography-500 leading-5">
            You can switch between roles anytime in your profile settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
