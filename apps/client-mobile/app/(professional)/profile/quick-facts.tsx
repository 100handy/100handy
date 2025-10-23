import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';

const QUICK_FACTS_LIST = [
  'I have a pet allergies',
  'I speak multiple languages',
  'I require a 2 hour minimum',
  'None of these apply',
];

export default function QuickFactsScreen() {
  const [selectedFacts, setSelectedFacts] = useState<string[]>([]);

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

  const handleSave = () => {
    // Save selected facts
    console.log('Selected facts:', selectedFacts);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HStack className="items-center px-5 py-4">
        <Pressable onPress={() => {/* Navigate back */}}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Quick Facts
        </Text>
      </HStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6 gap-6">
          {/* Info Section */}
          <VStack className="gap-2">
            <Text className="text-xl font-bold text-[#333A31]" style={{ fontFamily: 'WorkSans_700Bold' }}>
              What's important to know about you?
            </Text>
          </VStack>

          {/* Subtitle */}
          <Text className="text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
            Pick all that apply
          </Text>

          {/* Quick Facts List */}
          <VStack className="gap-3">
            {QUICK_FACTS_LIST.map((fact) => (
              <SelectableItem
                key={fact}
                label={fact}
                isSelected={selectedFacts.includes(fact)}
                onPress={() => toggleFact(fact)}
              />
            ))}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Save Button */}
      <VStack className="px-5 pb-8 pt-4">
        <Pressable
          onPress={handleSave}
          className="bg-[#D17852] rounded-full py-4 items-center"
        >
          <Text className="text-white text-base font-semibold" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
            Save
          </Text>
        </Pressable>
      </VStack>
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
      className={`rounded-lg px-4 py-3.5 ${isSelected ? 'bg-[#D17852]/10 border border-[#D17852]' : 'bg-[#F5F5F5]'}`}
    >
      <Text 
        className={`text-base ${isSelected ? 'text-[#333A31]' : 'text-[#333A31]'}`}
        style={{ fontFamily: 'WorkSans_400Regular' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}