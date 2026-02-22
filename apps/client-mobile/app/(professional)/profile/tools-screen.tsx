import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';
import { useToast } from '@/components/ui/toast';

const TOOLS_LIST = [
  'Carpet cleaner',
  'Dolly',
  'Eco-friendly cleaning products',
  'Ladder',
  'Lawn mower',
  'Power drill',
  'Power saw',
];

export default function ToolsScreen() {
  const { tools, setTools, loadProfile } = useProfessionalProfileStore();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const toast = useToast();

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setSelectedTools(tools);
  }, [tools]);

  const toggleTool = (tool: string) => {
    setSelectedTools(prev =>
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const handleSave = async () => {
    try {
      await setTools(selectedTools);
      toast.success('Saved', 'Your tools have been updated');
      router.back();
    } catch (error) {
      toast.error('Error', 'Failed to save tools');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-brand-dark pr-6" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Tools
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Info Section */}
          <View className="flex-col gap-2">
            <Text className="text-xl font-bold text-brand-dark" style={{ fontFamily: 'WorkSans_700Bold' }}>
              Have anything special?
            </Text>
            <Text className="text-sm text-[#666666] leading-5" style={{ fontFamily: 'WorkSans_400Regular' }}>
              Clients expect you to bring the essentials, but highlighting these really make you stand out.
            </Text>
          </View>

          {/* Subtitle */}
          <Text className="text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
            Pick all that apply
          </Text>

          {/* Tools List */}
          <View className="flex-col gap-3">
            {TOOLS_LIST.map((tool) => (
              <SelectableItem
                key={tool}
                label={tool}
                isSelected={selectedTools.includes(tool)}
                onPress={() => toggleTool(tool)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="flex-col px-5 pb-8 pt-4">
        <Pressable
          onPress={handleSave}
          className="bg-brand-terracotta rounded-full py-4 items-center"
        >
          <Text className="text-white text-base font-semibold" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
            Save
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

interface SelectableItemProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function SelectableItem({ label, isSelected, onPress }: SelectableItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-4 py-3.5 ${isSelected ? 'bg-brand-terracotta/10 border border-brand-terracotta' : 'bg-[#F5F5F5]'}`}
    >
      <Text 
        className={`text-base ${isSelected ? 'text-brand-dark' : 'text-brand-dark'}`}
        style={{ fontFamily: 'WorkSans_400Regular' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}