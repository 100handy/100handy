import React, { useState, useEffect } from 'react';
import { ScrollView, View, Pressable as RNPressable } from 'react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from '@/components/ui/actionsheet';
  import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ChevronLeft } from 'lucide-react-native';
import {
  useLocationStore,
  useTaskFormStore,
} from '@shared/supabase';
import { useRouter } from 'expo-router';
import { LocationAutocomplete } from '@/components/location';

interface LocationSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
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

function LocationStep({
  title,
  onContinue
}: {
  title: string;
  onContinue: () => void;
}) {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  // Pre-fill with default location if available
  const [streetAddress, setStreetAddress] = useState(location?.streetAddress || '');
  const [unitNumber, setUnitNumber] = useState(location?.unitNumber || '');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(location?.placeId || null);
  
  // Update fields when location changes
  useEffect(() => {
    if (location?.streetAddress) {
      setStreetAddress(location.streetAddress);
      setUnitNumber(location.unitNumber || '');
      setSelectedPlaceId(location.placeId || null);
    }
  }, [location]);

  const handleSelectLocation = (locationData: any) => {
    setSelectedPlaceId(locationData.place_id);
    // The address is already set by LocationAutocomplete's onChangeText
  };

  const handleContinue = () => {
    if (streetAddress.trim()) {
      // Parse address to extract city and country
      const addressParts = streetAddress.split(',').map(part => part.trim());
      const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';

      setLocation({
        streetAddress: streetAddress.trim(),
        unitNumber: unitNumber.trim() || undefined,
        placeId: selectedPlaceId || undefined,
        city,
        country,
        formattedAddress: streetAddress.trim(),
      });
      onContinue();
    }
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
            {title}
          </Text>

          {/* Question */}
          <Text className="text-xl font-semibold text-black mb-6">
            What is the task location?
          </Text>

          {/* Street Address Input with Autocomplete */}
          <VStack className="mb-5">
            <LocationAutocomplete
              value={streetAddress}
              onChangeText={setStreetAddress}
              onSelectLocation={handleSelectLocation}
              label="Street address"
              placeholder="Enter street address"
              showClearButton={true}
            />
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
          {location && (
            <VStack className="mb-8">
              <Text
                className="text-sm font-normal mb-4 text-gray-400"
              >
                Default
              </Text>

              <RNPressable className="py-2" onPress={() => {
                if (location.streetAddress) {
                  setStreetAddress(location.streetAddress);
                  setUnitNumber(location.unitNumber || '');
                }
              }}>
                <Text className="text-base font-normal text-black leading-6">
                  {location.streetAddress}
                  {location.unitNumber && `\n${location.unitNumber}`}
                </Text>
              </RNPressable>
            </VStack>
          )}
        </VStack>
      </ScrollView>

      {/* Continue Button - Fixed at Bottom */}
      <VStack className="px-5 py-6 w-full border-t border-gray-100">
        <RNPressable
          onPress={handleContinue}
          disabled={!streetAddress.trim()}
          className={`w-full py-4 items-center rounded-full ${!streetAddress.trim() ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">
            Continue
          </Text>
        </RNPressable>
      </VStack>
    </>
  );
}

// Task Size Step
function TaskSizeStep({
  title,
  onContinue
}: {
  title: string;
  onContinue: () => void;
}) {
  const setTaskOption = useTaskFormStore((state) => state.setTaskOption);
  const taskOptions = useTaskFormStore((state) => state.formData.taskOptions);
  const [selectedSize, setSelectedSize] = useState<string>(taskOptions.taskSize || '');

  const taskSizeOptions = [
    'Small – Est. 1 hr',
    'Medium – Est. 2-3 hrs',
    'Large – Est. 4+ hrs',
  ];

  const handleContinue = () => {
    const sizeMap: Record<string, string> = {
      'Small – Est. 1 hr': 'small',
      'Medium – Est. 2-3 hrs': 'medium',
      'Large – Est. 4+ hrs': 'large',
    };
    setTaskOption('taskSize', sizeMap[selectedSize]);
    onContinue();
  };

  return (
    <SelectionStep
      title={title}
      question="How big is your task?"
      options={taskSizeOptions}
      selectedOptions={selectedSize ? [selectedSize] : []}
      onSelectOption={(option) => setSelectedSize(option as string)}
      onContinue={handleContinue}
      optionAlignment="start"
    />
  );
}

// Vehicle Requirements Step
const vehicleOptions = [
  'Not needed for task',
  'Task requires a car',
  'Task requires a truck',
];

function VehicleRequirementStep({
  title,
  onContinue
}: {
  title: string;
  onContinue: () => void;
}) {
  const setTaskOption = useTaskFormStore((state) => state.setTaskOption);
  const taskOptions = useTaskFormStore((state) => state.formData.taskOptions);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(taskOptions.vehicleRequirement || '');

  const handleContinue = () => {
    const vehicleMap: Record<string, string> = {
      'Not needed for task': 'not-needed',
      'Task requires a car': 'car',
      'Task requires a truck': 'truck',
    };
    setTaskOption('vehicleRequirement', vehicleMap[selectedVehicle]);
    onContinue();
  };

  return (
    <SelectionStep
      title={title}
      question="Does your Tasker need a vehicle?"
      description="Some tasks may require transportation of equipment or materials."
      options={vehicleOptions}
      selectedOptions={selectedVehicle ? [selectedVehicle] : []}
      onSelectOption={(option) => setSelectedVehicle(option as string)}
      onContinue={handleContinue}
    />
  );
}

export default function LocationSelectionSheet({
  isOpen,
  onClose,
  categoryId,
  categoryName,
}: LocationSelectionSheetProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const reset = useTaskFormStore((state) => state.reset);
  const setCategory = useTaskFormStore((state) => state.setCategory);
  const taskOptions = useTaskFormStore((state) => state.formData.taskOptions);

  // Set category when sheet opens
  useEffect(() => {
    if (isOpen && categoryId && categoryName) {
      setCategory(categoryId, categoryName);
    }
  }, [isOpen, categoryId, categoryName]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      reset();
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // After step 3, navigate to select-tasker screen
      onClose();
      router.push({
        pathname: '/(client)/select-tasker',
        params: {
          categoryId,
          categoryName,
          taskSize: taskOptions.taskSize,
          vehicleRequirement: taskOptions.vehicleRequirement,
          taskDetails: taskOptions.taskDetails || '',
        },
      });
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
            {Array.from({ length: 5 }).map((_, index) => (
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

        {step === 1 && <LocationStep title={categoryName} onContinue={handleNextStep} />}
        {step === 2 && <TaskSizeStep title={categoryName} onContinue={handleNextStep} />}
        {step === 3 && <VehicleRequirementStep title={categoryName} onContinue={handleNextStep} />}
      </ActionsheetContent>
    </Actionsheet>
  );
}
