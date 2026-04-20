import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

const MAX_CHARACTERS = 500;

export default function AboutMeScreen() {
  const { aboutMe, setAboutMe, loadProfile } = useProfessionalProfileStore();
  const [text, setText] = useState('');
  const toast = useToast();

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setText(aboutMe);
  }, [aboutMe]);

  const handleSave = async () => {
    try {
      await setAboutMe(text);
      toast.success('Saved', 'Your about me has been updated');
      router.back();
    } catch (error) {
      toast.error('Error', 'Failed to save about me');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#000" />
          </Pressable>
          <Text 
            className="flex-1 text-center text-lg font-semibold text-brand-dark pr-6" 
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            About Me
          </Text>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-col px-5 py-6 gap-6">
            {/* Section Title */}
            <View className="flex-col gap-2">
              <Text 
                className="text-xl font-bold text-brand-dark" 
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Why do you task?
              </Text>
              <Text 
                className="text-sm text-[#666666] leading-5" 
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Why are you a 100Handy Pro? Tell your story..
              </Text>
            </View>

            {/* Text Input */}
            <View className="flex-col gap-2">
              <TextInput
                placeholder="For example, what supplies are needed, where to park, or timing restrictions."
                placeholderTextColor="#9CA3AF"
                value={text}
                onChangeText={(value) => {
                  if (value.length <= MAX_CHARACTERS) {
                    setText(value);
                  }
                }}
                multiline
                numberOfLines={8}
                maxLength={MAX_CHARACTERS}
                className="min-h-[200px] border border-[#E5E5E5] rounded-lg p-4 text-base text-brand-dark"
                style={{
                  fontFamily: 'WorkSans_400Regular',
                  textAlignVertical: 'top',
                }}
              />
              
              {/* Character Counter */}
              <View className="flex-row justify-end">
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  {text.length}/{MAX_CHARACTERS}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="flex-col px-5 pb-8 pt-4">
          <Pressable
            onPress={handleSave}
            className="bg-brand-terracotta rounded-full py-4 items-center active:opacity-90"
          >
            <Text 
              className="text-white text-base font-semibold" 
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              Save
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}