import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Link, LinkText } from "@/components/ui/link";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signInWithProvider } from "@shared/supabase/auth";

import TaskHelperLogo from "../assets/images/task-helper-logo.svg";
import GoogleLogo from "../assets/images/google-logo.svg";
import AppleLogo from "../assets/images/apple-logo.svg";
import FacebookLogo from "../assets/images/facebook-logo.svg";
import { SafeAreaView, StatusBar } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      await signInWithProvider(provider);
      // The redirect will be handled by Supabase OAuth flow
    } catch (error) {
      console.error('Social login error:', error);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSignUp = () => {
    // router.push('/(auth)/sign-up');
    router.push('/(auth)/sign-up');
  };

  return (
    <SafeAreaView className="flex-1 bg-themeBackground">
      <StatusBar barStyle="dark-content" />
      <VStack className="flex-1 justify-center items-center p-6">
        <VStack className="items-center mb-10">
          <Box className="w-20 h-20 bg-white rounded-2xl shadow-lg justify-center items-center mb-4">
            <TaskHelperLogo width={40} height={40} />
          </Box>
          <Heading className="font-worksans-bold text-2xl text-typography-900 mb-2">
            TaskHelper
          </Heading>
          <Text className="font-worksans text-center text-typography-600 text-base">
            Get help with home tasks fast and trusted
          </Text>
        </VStack>

        <VStack className="w-full mb-6">
          <Pressable
            className={`bg-clayOrange p-4 rounded-xl mb-4 shadow-md ${loading ? 'opacity-50' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="font-worksans-bold text-typography-white text-center font-bold text-lg">
              Log in
            </Text>
          </Pressable>
          <Pressable
            className={`bg-sageGreen p-4 rounded-xl shadow-md ${loading ? 'opacity-50' : ''}`}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="font-worksans-bold text-typography-white text-center font-bold text-lg">
              Sign up
            </Text>
          </Pressable>
        </VStack>

        <Box className="flex-row items-center w-full mb-4">
          <Box className="flex-1 h-px bg-outline-300" />
          <Text className="font-worksans text-typography-500 mx-4 text-sm">or continue with</Text>
          <Box className="flex-1 h-px bg-outline-300" />
        </Box>

        <VStack className="w-full">
          <Pressable
            className={`flex-row items-center justify-center bg-typography-white p-4 rounded-xl mb-4 border border-outline-200 shadow-sm ${loading ? 'opacity-50' : ''}`}
            onPress={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <GoogleLogo width={24} height={24} className="mr-3" />
            <Text className="font-worksans-bold text-typography-900 font-bold text-base">
              Continue with Google
            </Text>
          </Pressable>
          <Pressable
            className={`flex-row items-center justify-center bg-typography-black p-4 rounded-xl mb-4 shadow-sm ${loading ? 'opacity-50' : ''}`}
            onPress={() => handleSocialLogin('apple')}
            disabled={loading}
          >
            <AppleLogo width={24} height={24} className="mr-3" />
            <Text className="font-worksans-bold text-typography-white font-bold text-base">
              Continue with Apple
            </Text>
          </Pressable>
          <Pressable
            className={`flex-row items-center justify-center bg-info-600 p-4 rounded-xl shadow-sm ${loading ? 'opacity-50' : ''}`}
            onPress={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            <FacebookLogo width={24} height={24} className="mr-3" />
            <Text className="font-worksans-bold text-typography-white font-bold text-base">
              Continue with Facebook
            </Text>
          </Pressable>
        </VStack>

        <VStack className="mt-8 w-full items-center">
          <Text className="font-worksans text-center text-xs text-typography-500 leading-5">
            By continuing, you agree to our <Link href="#"><LinkText underline>Terms of Service</LinkText></Link> and <Link href="#"><LinkText underline>Privacy Policy</LinkText></Link>
          </Text>
          <Link href="#" className="mt-4">
            <LinkText className="font-worksans text-center text-xs text-typography-500 leading-4" underline>
              Need help? Contact Support
            </LinkText>
          </Link>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
