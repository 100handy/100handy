import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View, Image } from "react-native";
import { Pressable } from "react-native";

import TaskHelperLogo from "../assets/images/task-helper-logo.svg";
import GoogleLogo from "../assets/images/google-logo.svg";
import AppleLogo from "../assets/images/apple-logo.svg";
import FacebookLogo from "../assets/images/facebook-logo.svg";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <View className="items-center mb-10">
        <TaskHelperLogo width={80} height={80} className="mb-4" />
        <Heading style={{ fontFamily: "Futura-Medium" }} className="text-3xl text-font mb-2">
          TaskHelper
        </Heading>
        <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-center text-font text-base">
          Get help with home tasks fast and trusted
        </Text>
      </View>

      <View className="w-full mb-6">
        <Pressable className="bg-clayOrange p-4 rounded-xl mb-4">
          <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-white text-center font-bold text-lg">
            Log in
          </Text>
        </Pressable>
        <Pressable className="bg-sageGreen p-4 rounded-xl">
          <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-white text-center font-bold text-lg">
            Sign up
          </Text>
        </Pressable>
      </View>

      <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-font mb-4">or continue with</Text>

      <View className="w-full">
        <Pressable className="flex-row items-center justify-center bg-white p-4 rounded-xl mb-4 border border-gray-200">
          <GoogleLogo width={24} height={24} className="mr-2" />
          <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-font font-bold text-base">
            Continue with Google
          </Text>
        </Pressable>
        <Pressable className="flex-row items-center justify-center bg-black p-4 rounded-xl mb-4">
          <AppleLogo width={24} height={24} className="mr-2" />
          <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-white font-bold text-base">
            Continue with Apple
          </Text>
        </Pressable>
        <Pressable className="flex-row items-center justify-center bg-blue-600 p-4 rounded-xl">
          <FacebookLogo width={24} height={24} className="mr-2" />
          <Text style={{ fontFamily: "SourceCodeProVariable" }} className="text-white font-bold text-base">
            Continue with Facebook
          </Text>
        </Pressable>
      </View>

      <View style={{ width: 342, height: 72 }}>
        <Text style={{
          fontFamily: 'Inter',
          fontWeight: '400',
          fontSize: 12,
          lineHeight: 20,
          color: '#000000',
          textAlign: 'center',
          marginBottom: 14
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Text style={{
          fontFamily: 'Inter',
          fontWeight: '400',
          fontSize: 12,
          lineHeight: 16,
          color: '#000000',
          textAlign: 'center'
        }}>
          Need help? Contact Support
        </Text>
      </View>
    </View>
  );
}
