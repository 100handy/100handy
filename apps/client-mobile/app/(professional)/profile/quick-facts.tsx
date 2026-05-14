import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { router } from 'expo-router'; import { ChevronLeft } from 'lucide-react-native'; import { useProfessionalProfileStore } from '@shared/store';
import { useToast } from '@/components/ui/toast';
import { goBackOrReplace } from '@/lib/navigation';

const QUICK_FACTS_LIST = [
  'I have pet allergies',
  'I speak multiple languages',
  'I require a 2 hour minimum',
  'None of these apply',
];

export default function QuickFactsScreen() {
  const { quickFacts, setQuickFacts, loadProfile } = useProfessionalProfileStore();
  const [selectedFacts, setSelectedFacts] = useState<string[]>([]);
  const toast = useToast();

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setSelectedFacts(quickFacts);
  }, [quickFacts]);

  const toggleFact = (fact: string) => {
    // If "None of these apply" is selected, clear all other selections
    if (fact === 'None of these apply') {
      setSelectedFacts(prev =>
        prev.includes(fact) ? [] : [fact]
      );
    } else {
      // If any other fact is selected, remove "None of these apply"
      setSelectedFacts(prev => {
        const filtered = prev.filter(f => f !== 'None of these apply');
        return filtered.includes(fact)
          ? filtered.filter(f => f !== fact)
          : [...filtered, fact];
      });
    }
  };

  const handleSave = async () => {
    try {
      await setQuickFacts(selectedFacts);
      toast.success('Saved', 'Your quick facts have been updated');
      goBackOrReplace(router, '/(professional)/(tabs)/profile');
    } catch (error) {
      toast.error('Error', 'Failed to save quick facts');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/profile')}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-brand-dark pr-6" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Quick Facts
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Info Section */}
          <View className="flex-col gap-2">
            <Text className="text-xl font-bold text-brand-dark" style={{ fontFamily: 'WorkSans_700Bold' }}>
              What's important to know about you?
            </Text>
          </View>

          {/* Subtitle */}
          <Text className="text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
            Pick all that apply
          </Text>

          {/* Quick Facts List */}
          <View className="flex-col gap-3">
            {QUICK_FACTS_LIST.map((fact) => (
              <SelectableItem
                key={fact}
                label={fact}
                isSelected={selectedFacts.includes(fact)}
                onPress={() => toggleFact(fact)}
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
