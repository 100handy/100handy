import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { TextareaInput } from '@/components/ui/textarea';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';

const MAX_CHARACTERS = 500;

export default function AboutMeScreen() {
  const { aboutMe, setAboutMe, loadProfile } = useProfessionalProfileStore();
  const [text, setText] = useState('');

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setText(aboutMe);
  }, [aboutMe]);

  const handleSave = async () => {
    await setAboutMe(text);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <HStack className="items-center px-5 py-4">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#000" />
          </Pressable>
          <Text 
            className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6" 
            style={{ fontFamily: 'WorkSans_600SemiBold' }}
          >
            About Me
          </Text>
        </HStack>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="px-5 py-6 gap-6">
            {/* Section Title */}
            <VStack className="gap-2">
              <Text 
                className="text-xl font-bold text-[#333A31]" 
                style={{ fontFamily: 'WorkSans_700Bold' }}
              >
                Why do you task?
              </Text>
              <Text 
                className="text-sm text-[#666666] leading-5" 
                style={{ fontFamily: 'WorkSans_400Regular' }}
              >
                Why are you a Tasker? Tell your story..
              </Text>
            </VStack>

            {/* Text Input */}
            <VStack className="gap-2">
              <Textarea
                className="min-h-[200px] border border-[#E5E5E5] rounded-lg p-4"
              >
                <TextareaInput
                  placeholder="For example, what supplies are needed, where to park, or timing restrictions."
                  value={text}
                  onChangeText={(value) => {
                    if (value.length <= MAX_CHARACTERS) {
                      setText(value);
                    }
                  }}
                  multiline
                  numberOfLines={8}
                  maxLength={MAX_CHARACTERS}
                  className="text-base text-[#333A31]"
                  placeholderTextColor="#999999"
                  style={{ 
                    fontFamily: 'WorkSans_400Regular',
                    textAlignVertical: 'top',
                  }}
                />
              </Textarea>
              
              {/* Character Counter */}
              <HStack className="justify-end">
                <Text 
                  className="text-sm text-[#666666]" 
                  style={{ fontFamily: 'WorkSans_400Regular' }}
                >
                  {text.length}/{MAX_CHARACTERS}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>

        {/* Save Button */}
        <VStack className="px-5 pb-8 pt-4">
          <Pressable
            onPress={handleSave}
            className="bg-[#D17852] rounded-full py-4 items-center active:opacity-90"
          >
            <Text 
              className="text-white text-base font-semibold" 
              style={{ fontFamily: 'WorkSans_600SemiBold' }}
            >
              Save
            </Text>
          </Pressable>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}