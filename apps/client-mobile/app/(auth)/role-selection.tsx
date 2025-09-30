import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { User, Briefcase, ArrowRight } from 'lucide-react-native';
import TaskHelperLogo from '../../assets/images/task-helper-logo.svg';

export default function AuthRoleSelectionScreen() {
  const router = useRouter();

  const handleClientAuth = (): void => {
    router.push('/(auth)/(client)/sign-in');
  };

  const handleProfessionalAuth = (): void => {
    router.push('/(auth)/(professional)/verify-getting-started');
  };

  return (
    <SafeAreaView className="flex-1 bg-theme-background">
      <StatusBar barStyle="dark-content" />
      <VStack className="flex-1 justify-center items-center p-6">
        {/* Logo and Title */}
        <VStack className="items-center mb-12">
          <Box className="w-20 h-20 bg-white rounded-2xl shadow-lg justify-center items-center mb-4">
            <TaskHelperLogo width={40} height={40} />
          </Box>
          <Heading className="font-worksans-bold text-2xl text-typography-900 mb-2">
            100Handy
          </Heading>
          <Text className="font-worksans text-center text-typography-600 text-base">
            Choose how you'd like to use the app
          </Text>
        </VStack>

        {/* Role Selection Cards */}
        <VStack className="w-full space-y-4 mb-8">
          {/* Client Role */}
          <Pressable
            className="bg-white border border-outline-200 rounded-2xl p-6 shadow-sm"
            onPress={handleClientAuth}
          >
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1">
                <Box className="w-12 h-12 bg-sage-green rounded-xl justify-center items-center mr-4">
                  <User color="white" size={24} />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-worksans-bold text-typography-900 text-lg mb-1">
                    I need help
                  </Text>
                  <Text className="font-worksans text-typography-600 text-sm">
                    Find professionals for home tasks
                  </Text>
                </VStack>
              </HStack>
              <ArrowRight color="#666" size={20} />
            </HStack>
          </Pressable>

          {/* Professional Role */}
          <Pressable
            className="bg-white border border-outline-200 rounded-2xl p-6 shadow-sm"
            onPress={handleProfessionalAuth}
          >
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1">
                <Box className="w-12 h-12 bg-clay-orange rounded-xl justify-center items-center mr-4">
                  <Briefcase color="white" size={24} />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-worksans-bold text-typography-900 text-lg mb-1">
                    I provide services
                  </Text>
                  <Text className="font-worksans text-typography-600 text-sm">
                    Earn money by helping others
                  </Text>
                </VStack>
              </HStack>
              <ArrowRight color="#666" size={20} />
            </HStack>
          </Pressable>
        </VStack>

        {/* Help Text */}
        <VStack className="w-full items-center">
          <Text className="font-worksans text-center text-xs text-typography-500 leading-5">
            You can switch between roles anytime in your profile settings
          </Text>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
