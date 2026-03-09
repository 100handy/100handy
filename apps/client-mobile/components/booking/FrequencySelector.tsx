import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { FREQUENCY_OPTIONS, type BookingFrequency } from '@shared/supabase';

interface FrequencySelectorProps {
  selectedFrequency: BookingFrequency;
  onFrequencyChange: (frequency: BookingFrequency) => void;
  disabledFrequencies?: BookingFrequency[];
  disabledMessage?: string;
}

export function FrequencySelector({
  selectedFrequency,
  onFrequencyChange,
  disabledFrequencies = [],
  disabledMessage,
}: FrequencySelectorProps) {
  return (
    <View className="flex-col bg-white rounded-lg border border-gray-300 p-5">
      <Text className="text-base font-semibold text-[#30352D] mb-1">Frequency</Text>
      <Text className="text-sm text-gray-600 mb-4">
        Save time and money by setting up a repeat cleaning with your Tasker.
      </Text>
      {disabledMessage ? (
        <Text className="text-sm mb-4" style={{ color: '#C1856A' }}>
          {disabledMessage}
        </Text>
      ) : null}

      <View className="flex-col gap-2">
        {FREQUENCY_OPTIONS.map((option) => {
          const isSelected = selectedFrequency === option.value;
          const isDisabled = disabledFrequencies.includes(option.value);

          return (
            <Pressable
              key={option.value}
              onPress={() => {
                if (!isDisabled) {
                  onFrequencyChange(option.value);
                }
              }}
              disabled={isDisabled}
              className={`
                py-4 px-5 border rounded-xl
                ${isSelected ? 'border-[#30352D] bg-gray-100' : 'border-gray-300 bg-white'}
                ${isDisabled ? 'opacity-50' : ''}
              `}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  {/* Radio circle */}
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      isSelected ? 'border-[#30352D] bg-[#30352D]' : 'border-gray-400'
                    }`}
                  >
                    {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
                  </View>

                  <View className="flex-col flex-1">
                    <Text
                      className={`text-base ${isSelected ? 'font-semibold text-black' : 'text-gray-800'}`}
                    >
                      {option.label}
                    </Text>
                    {option.discountPercent > 0 && (
                      <Text className="text-sm mt-0.5" style={{ color: '#82BE56' }}>
                        Save {option.discountPercent}%
                        {option.value === 'biweekly' && (
                          <Text className="text-sm" style={{ color: '#82BE56' }}>
                            {' '}
                            - Most Popular
                          </Text>
                        )}
                      </Text>
                    )}
                  </View>
                </View>

                {isSelected && <Check size={20} color="#30352D" strokeWidth={2.5} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
