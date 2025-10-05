import React, { useState } from 'react';
import { ScrollView, View, Pressable as RNPressable } from 'react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from '@/components/ui/actionsheet';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ChevronLeft, X } from 'lucide-react-native';

interface LocationSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectionStepProps {
  title: string;
  question: string;
  description?: string;
  options: (string | number)[];
  selectedOptions: (string | number)[];
  onSelectOption: (option: string | number) => void;
  onContinue: () => void;
  optionAlignment?: 'center' | 'start';
}

function SelectionStep({
  title,
  question,
  description,
  options,
  selectedOptions,
  onSelectOption,
  onContinue,
  optionAlignment = 'start',
}: SelectionStepProps) {
  const isSelected = (option: string | number) => {
    return selectedOptions.includes(option);
  };

  const isDisabled = selectedOptions.length === 0;

  return (
    <>
      <ScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 pt-4 pb-6">
          <Text className="text-3xl font-bold text-[#30352d] text-center mb-10">{title}</Text>
          <VStack space="sm" className="mb-6">
            <Text className="text-xl font-semibold text-black">{question}</Text>
            {description && <Text className="text-sm text-gray-500">{description}</Text>}
          </VStack>
          <VStack space="md">
            {options.map((option) => {
              const selected = isSelected(option);
              return (
                <RNPressable
                  key={option.toString()}
                  onPress={() => onSelectOption(option)}
                  className={`
                    py-4 px-5 border rounded-full
                    items-${optionAlignment}
                    ${selected ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'}
                  `}
                >
                  <Text className={`text-base ${selected ? 'font-bold text-black' : 'text-gray-800'}`}>
                    {option}
                  </Text>
                </RNPressable>
              );
            })}
          </VStack>
        </VStack>
      </ScrollView>

      <VStack className="px-5 py-6 w-full border-t border-gray-100">
        <RNPressable
          onPress={onContinue}
          disabled={isDisabled}
          className={`w-full py-4 items-center rounded-full ${isDisabled ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
        </RNPressable>
      </VStack>
    </>
  );
}

function LocationStep({ onContinue }: { onContinue: () => void }) {
  const [streetAddress, setStreetAddress] = useState('16 Leicester Square, London WC2H 7...');
  const [unitNumber, setUnitNumber] = useState('');

  const handleClearAddress = () => {
    setStreetAddress('');
  };

  return (
    <>
      <ScrollView 
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
      >
        <VStack className="px-5 pt-4 pb-6">
          {/* Task Title */}
          <Text className="text-3xl font-bold text-black text-center mb-10">
            TV Mounting
          </Text>

          {/* Question */}
          <Text className="text-xl font-semibold text-black mb-6">
            What is the task location?
          </Text>

          {/* Street Address Input */}
          <VStack className="mb-5">
            <Text 
              className="text-sm font-normal mb-2 text-gray-400"
            >
              Street address
            </Text>
            
            <Input
              variant="outline"
              size="xl"
              className="border-gray-200 rounded-xl min-h-[56px]"
            >
              <InputField
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="Enter street address"
                className="text-base px-4 text-black"
              />
              {streetAddress.length > 0 && (
                <InputSlot className="pr-4" onPress={handleClearAddress}>
                  <X size={22} color="#9CA3AF" strokeWidth={2} />
                </InputSlot>
              )}
            </Input>
          </VStack>

          {/* Unit Number Input */}
          <VStack className="mb-8">
            <Text 
              className="text-sm font-normal mb-2 text-gray-400"
            >
              Optional unit or apt #
            </Text>
            
            <Input
              variant="outline"
              size="xl"
              className="border-gray-200 rounded-xl min-h-[56px]"
            >
              <InputField
                value={unitNumber}
                onChangeText={setUnitNumber}
                placeholder=""
                className="text-base px-4 text-black"
              />
            </Input>
          </VStack>

          {/* Divider */}
          <View 
            className="w-full mb-4 h-px bg-gray-200"
          />

          {/* Default Address Section */}
          <VStack className="mb-8">
            <Text 
              className="text-sm font-normal mb-4 text-gray-400"
            >
              Default
            </Text>
            
            <RNPressable className="py-2">
              <Text className="text-base font-normal text-black leading-6">
                16 Leicester Square, London{'\n'}WC2H 7LE, UK
              </Text>
            </RNPressable>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Continue Button - Fixed at Bottom */}
      <VStack className="px-5 py-6 w-full border-t border-gray-100">
        <RNPressable
          onPress={onContinue}
          className="w-full py-4 items-center bg-[#C1856A] rounded-full"
        >
          <Text className="text-lg font-bold text-white">
            Continue
          </Text>
        </RNPressable>
      </VStack>
    </>
  );
}

function TVQuantityStep({ onContinue }: { onContinue: () => void }) {
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const tvQuantityOptions = [1, 2, 3, 4, 5];

  return (
    <SelectionStep
      title="Describe your task"
      question="How many TVs do you need installed?"
      options={tvQuantityOptions}
      selectedOptions={selectedQuantity !== null ? [selectedQuantity] : []}
      onSelectOption={(option) => setSelectedQuantity(option as number)}
      onContinue={onContinue}
      optionAlignment="center"
    />
  );
}

const helpOptions = [
  'Someone will be around',
  'No one will be around. 1 or more TVs above 60”',
  'Not needed. No TVs above 60”',
  'Unsure if needed',
];

function HelpNeededStep({ onContinue }: { onContinue: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <SelectionStep
      title="Describe your task"
      question="Will someone be around to help your Tasker lift the TV into place?"
      description="Larger TVs (60” +) may require a second person for safe mounting."
      options={helpOptions}
      selectedOptions={selectedOption !== null ? [selectedOption] : []}
      onSelectOption={(option) => setSelectedOption(option as string)}
      onContinue={onContinue}
    />
  );
}

const mountOptions = [
  'Fixed / low profile',
  'Tilting',
  'Articulating / full motion',
  'Other / Not sure',
];

function TVMountStep({ onContinue }: { onContinue: () => void }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectOption = (option: string | number) => {
    const optionStr = option as string;
    setSelectedOptions(prev => 
      prev.includes(optionStr) 
        ? prev.filter(item => item !== optionStr) 
        : [...prev, optionStr]
    );
  };

  return (
    <SelectionStep
      title="Describe your task"
      question="What type of TV mount do you want to use?"
      description="Select all that apply."
      options={mountOptions}
      selectedOptions={selectedOptions}
      onSelectOption={handleSelectOption}
      onContinue={onContinue}
      optionAlignment="center"
    />
  );
}

export default function LocationSelectionSheet({
  isOpen,
  onClose,
}: LocationSelectionSheetProps) {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      onClose();
      // Navigate to next step or proceed with booking
      console.log('Continue with booking');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-white" style={{ minHeight: '90%' }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-gray-300" />
        </ActionsheetDragIndicatorWrapper>
        
        {/* Header with Back Button and Progress Dots */}
        <HStack className="w-full items-center px-5 pt-4 pb-2">
          <RNPressable onPress={handlePrevStep} className="mr-4">
            <ChevronLeft size={28} color="#000000" strokeWidth={2} />
          </RNPressable>
          
          <HStack className="flex-1 items-center justify-center gap-2 mr-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: index < step ? '#C1856A' : '#D1D5DB',
                }}
              />
            ))}
          </HStack>
        </HStack>
        
        {step === 1 && <LocationStep onContinue={handleNextStep} />}
        {step === 2 && <TVQuantityStep onContinue={handleNextStep} />}
        {step === 3 && <HelpNeededStep onContinue={handleNextStep} />}
        {step === 4 && <TVMountStep onContinue={handleNextStep} />}

      </ActionsheetContent>
    </Actionsheet>
  );
}
