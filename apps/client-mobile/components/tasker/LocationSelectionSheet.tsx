import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Pressable as RNPressable, Text, TextInput, ActivityIndicator } from 'react-native';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { Input, InputField } from '@/components/ui/input';
import { ChevronLeft, X, Check, MapPin } from 'lucide-react-native';
import {
  useLocationStore,
  useTaskFormStore,
  useCategoryFormFields,
  type FormField,
  type Location,
} from '@shared/supabase';
import { useRouter } from 'expo-router';
import { LocationAutocomplete } from '@/components/location';
import * as ExpoLocation from 'expo-location';

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
        <View className="px-5 pt-4 pb-6 flex-col">
          <Text className="text-3xl font-extrabold text-[#30352d] text-center mb-10" style={{ letterSpacing: -0.5 }}>{title}</Text>
          <View className="mb-6 flex-col">
            <Text className="text-xl font-semibold text-black">{question}</Text>
            {description && <Text className="text-sm text-gray-500">{description}</Text>}
          </View>
          <View className="flex-col">
            {options.map((option) => {
              const selected = isSelected(option);
              return (
                <RNPressable
                  key={option.toString()}
                  onPress={() => onSelectOption(option)}
                  className={`
                    py-4 px-5 border rounded-full my-2
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
          </View>
        </View>
      </ScrollView>

      <View className="px-5 py-6 w-full border-t border-gray-100 flex-col">
        <RNPressable
          onPress={onContinue}
          disabled={isDisabled}
          className={`w-full py-4 items-center rounded-full ${isDisabled ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
        </RNPressable>
      </View>
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
  const recentLocations = useLocationStore((state) => state.recentLocations) || [];
  const setLocation = useLocationStore((state) => state.setLocation);

  // State for current GPS location (Default)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(true);

  // Pre-fill with empty values
  const [streetAddress, setStreetAddress] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedLatitude, setSelectedLatitude] = useState<number | undefined>();
  const [selectedLongitude, setSelectedLongitude] = useState<number | undefined>();

  // Fetch current GPS location on mount
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsLoadingCurrentLocation(false);
          return;
        }

        const position = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });

        // Reverse geocode to get address
        const [geocode] = await ExpoLocation.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (geocode) {
          const city = geocode.city || geocode.subregion || '';
          const country = geocode.country || '';
          const streetAddress = [
            geocode.streetNumber,
            geocode.street,
            geocode.city,
            geocode.region,
            geocode.country,
          ]
            .filter(Boolean)
            .join(', ');

          setCurrentLocation({
            streetAddress,
            city,
            country,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            formattedAddress: streetAddress,
          });
        }
      } catch (error) {
        console.error('Error fetching current location:', error);
      } finally {
        setIsLoadingCurrentLocation(false);
      }
    };

    fetchCurrentLocation();
  }, []);

  const handleSelectLocation = (locationData: any) => {
    setSelectedPlaceId(locationData.place_id);
    // Extract coordinates if available from the locationData
    if (locationData.geometry?.location) {
      setSelectedLatitude(locationData.geometry.location.lat);
      setSelectedLongitude(locationData.geometry.location.lng);
    }
  };

  const handleSelectSavedLocation = (savedLocation: Location | null) => {
    if (!savedLocation) return;
    setStreetAddress(savedLocation.streetAddress);
    setUnitNumber(savedLocation.unitNumber || '');
    setSelectedPlaceId(savedLocation.placeId || null);
    setSelectedLatitude(savedLocation.latitude);
    setSelectedLongitude(savedLocation.longitude);
  };

  // Format location as "City, Country"
  const formatLocationShort = (loc: Location | null) => {
    if (!loc) return '';
    if (loc.city && loc.country) {
      return `${loc.city}, ${loc.country}`;
    }
    // Fallback: try to extract from streetAddress
    const parts = loc.streetAddress.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    return loc.streetAddress;
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
        latitude: selectedLatitude,
        longitude: selectedLongitude,
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
        <View className="px-5 pt-4 pb-6 flex-col">
          {/* Task Title */}
          <Text className="text-3xl font-extrabold text-[#30352d] text-center mb-10" style={{ letterSpacing: -0.5 }}>
            {title}
          </Text>

          {/* Question */}
          <Text className="text-xl font-semibold text-black mb-6">
            What is the task location?
          </Text>

          {/* Street Address Input with Autocomplete */}
          <View className="mb-5 flex-col">
            <LocationAutocomplete
              value={streetAddress}
              onChangeText={setStreetAddress}
              onSelectLocation={handleSelectLocation}
              label="Street address"
              placeholder="Enter street address"
              showClearButton={true}
            />
          </View>

          {/* Unit Number Input */}
          <View className="mb-8 flex-col">
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
          </View>

          {/* Divider */}
          <View
            className="w-full mb-4 h-px bg-gray-200"
          />

          {/* Default Location Section (Current GPS Location) */}
          <View className="mb-6 flex-col">
            <Text
              className="text-sm font-normal mb-3 text-gray-400"
            >
              Default
            </Text>

            {isLoadingCurrentLocation ? (
              <View className="py-3 px-4 bg-gray-50 rounded-xl flex-row items-center">
                <ActivityIndicator size="small" color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-2">
                  Getting your location...
                </Text>
              </View>
            ) : currentLocation ? (
              <RNPressable
                className="py-3 px-4 bg-gray-50 rounded-xl flex-row items-center"
                onPress={() => handleSelectSavedLocation(currentLocation)}
              >
                <MapPin size={18} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-medium text-black">
                    {formatLocationShort(currentLocation)}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                    {currentLocation.streetAddress}
                  </Text>
                </View>
              </RNPressable>
            ) : (
              <View className="py-3 px-4 bg-gray-50 rounded-xl">
                <Text className="text-sm text-gray-500">
                  Location access not available
                </Text>
              </View>
            )}
          </View>

          {/* Recent Locations Section */}
          {recentLocations.length > 0 && (
            <View className="mb-4 flex-col">
              <Text
                className="text-sm font-normal mb-3 text-gray-400"
              >
                Recent
              </Text>

              {recentLocations.map((recentLoc, index) => (
                <RNPressable
                  key={recentLoc.placeId || recentLoc.streetAddress || index}
                  className="py-3 px-4 bg-gray-50 rounded-xl mb-2"
                  onPress={() => handleSelectSavedLocation(recentLoc)}
                >
                  <Text className="text-base font-medium text-black">
                    {formatLocationShort(recentLoc)}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                    {recentLoc.streetAddress}
                  </Text>
                </RNPressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at Bottom */}
      <View className="px-5 py-6 w-full border-t border-gray-100 flex-col">
        <RNPressable
          onPress={handleContinue}
          disabled={!streetAddress.trim()}
          className={`w-full py-4 items-center rounded-full ${!streetAddress.trim() ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">
            Continue
          </Text>
        </RNPressable>
      </View>
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

// Dynamic Step Renderer for Radio/Select fields
function RadioStepRenderer({
  field,
  value,
  onChange,
  categoryName,
  onContinue,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  categoryName: string;
  onContinue: () => void;
}) {
  const options = field.options || [];
  const isDisabled = field.required && !value;

  return (
    <>
      <ScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6 flex-col">
          <Text className="text-3xl font-extrabold text-[#30352d] text-center mb-10" style={{ letterSpacing: -0.5 }}>
            {categoryName}
          </Text>
          <View className="mb-6 flex-col">
            <Text className="text-xl font-semibold text-black">{field.label}</Text>
            {field.description && <Text className="text-sm text-gray-500 mt-1">{field.description}</Text>}
          </View>
          <View className="flex-col">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <RNPressable
                  key={String(option.value)}
                  onPress={() => onChange(option.value)}
                  className={`py-4 px-5 border rounded-full my-2 ${isSelected ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'}`}
                >
                  <Text className={`text-base ${isSelected ? 'font-bold text-black' : 'text-gray-800'}`}>
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text className="text-sm text-gray-500 mt-1">{option.description}</Text>
                  )}
                </RNPressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 py-6 w-full border-t border-gray-100 flex-col">
        <RNPressable
          onPress={onContinue}
          disabled={isDisabled}
          className={`w-full py-4 items-center rounded-full ${isDisabled ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
        </RNPressable>
      </View>
    </>
  );
}

// Dynamic Step Renderer for Checkbox fields (multi-select)
function CheckboxStepRenderer({
  field,
  value,
  onChange,
  categoryName,
  onContinue,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  categoryName: string;
  onContinue: () => void;
}) {
  const options = field.options || [];
  const selectedValues = Array.isArray(value) ? value : [];
  const isDisabled = field.required && selectedValues.length === 0;

  const toggleOption = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v: string) => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <>
      <ScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6 flex-col">
          <Text className="text-3xl font-extrabold text-[#30352d] text-center mb-10" style={{ letterSpacing: -0.5 }}>
            {categoryName}
          </Text>
          <View className="mb-6 flex-col">
            <Text className="text-xl font-semibold text-black">{field.label}</Text>
            {field.description && <Text className="text-sm text-gray-500 mt-1">{field.description}</Text>}
          </View>
          <View className="flex-col">
            {options.map((option) => {
              const optionValue = String(option.value);
              const isChecked = selectedValues.includes(optionValue);
              return (
                <RNPressable
                  key={optionValue}
                  onPress={() => toggleOption(optionValue)}
                  className={`py-4 px-5 border rounded-xl my-2 flex-row items-center gap-3 ${isChecked ? 'border-[#30352D] bg-gray-100' : 'border-gray-300 bg-white'}`}
                >
                  <View className={`w-5 h-5 rounded border-2 items-center justify-center ${isChecked ? 'border-[#30352D] bg-[#30352D]' : 'border-gray-400 bg-white'}`}>
                    {isChecked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <View className="flex-col flex-1">
                    <Text className={`text-base ${isChecked ? 'font-semibold text-black' : 'text-gray-800'}`}>
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text className="text-sm text-gray-600 mt-1">{option.description}</Text>
                    )}
                  </View>
                </RNPressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 py-6 w-full border-t border-gray-100 flex-col">
        <RNPressable
          onPress={onContinue}
          disabled={isDisabled}
          className={`w-full py-4 items-center rounded-full ${isDisabled ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
        </RNPressable>
      </View>
    </>
  );
}

// Dynamic Step Renderer for Text/Textarea fields
function TextStepRenderer({
  field,
  value,
  onChange,
  categoryName,
  onContinue,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  categoryName: string;
  onContinue: () => void;
}) {
  const isTextarea = field.field_type === 'textarea';
  const isDisabled = field.required && !value?.trim();

  return (
    <>
      <ScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6 flex-col">
          <Text className="text-3xl font-extrabold text-[#30352d] text-center mb-10" style={{ letterSpacing: -0.5 }}>
            {categoryName}
          </Text>
          <View className="mb-6 flex-col">
            <Text className="text-xl font-semibold text-black">{field.label}</Text>
            {field.description && <Text className="text-sm text-gray-500 mt-1">{field.description}</Text>}
          </View>

          {isTextarea ? (
            <TextInput
              value={value || ''}
              onChangeText={onChange}
              placeholder={field.placeholder || ''}
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              maxLength={field.max_length || undefined}
              className="bg-gray-50 rounded-lg px-4 py-3 text-base text-[#30352D]"
              style={{
                minHeight: 120,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            />
          ) : (
            <Input
              variant="outline"
              size="xl"
              className="border-gray-200 rounded-xl min-h-[56px]"
            >
              <InputField
                value={value || ''}
                onChangeText={onChange}
                placeholder={field.placeholder || ''}
                className="text-base px-4 text-black"
              />
            </Input>
          )}

          {isTextarea && field.max_length && (
            <Text className="text-xs text-gray-500 mt-1">
              {(value || '').length} / {field.max_length} characters
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="px-5 py-6 w-full border-t border-gray-100 flex-col">
        <RNPressable
          onPress={onContinue}
          disabled={isDisabled}
          className={`w-full py-4 items-center rounded-full ${isDisabled ? 'bg-gray-300' : 'bg-[#C1856A]'}`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
        </RNPressable>
      </View>
    </>
  );
}

// Dynamic Step Renderer for Select fields (dropdown-style, but rendered as radio for consistency)
function SelectStepRenderer({
  field,
  value,
  onChange,
  categoryName,
  onContinue,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  categoryName: string;
  onContinue: () => void;
}) {
  // Reuse RadioStepRenderer for select fields since they're visually similar
  return (
    <RadioStepRenderer
      field={field}
      value={value}
      onChange={onChange}
      categoryName={categoryName}
      onContinue={onContinue}
    />
  );
}

// Main Dynamic Step Renderer that dispatches to the right renderer
function DynamicStepRenderer({
  field,
  value,
  onChange,
  categoryName,
  onContinue,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  categoryName: string;
  onContinue: () => void;
}) {
  switch (field.field_type) {
    case 'radio':
      return (
        <RadioStepRenderer
          field={field}
          value={value}
          onChange={onChange}
          categoryName={categoryName}
          onContinue={onContinue}
        />
      );
    case 'select':
      return (
        <SelectStepRenderer
          field={field}
          value={value}
          onChange={onChange}
          categoryName={categoryName}
          onContinue={onContinue}
        />
      );
    case 'checkbox':
      return (
        <CheckboxStepRenderer
          field={field}
          value={value}
          onChange={onChange}
          categoryName={categoryName}
          onContinue={onContinue}
        />
      );
    case 'text':
    case 'textarea':
    case 'number':
      return (
        <TextStepRenderer
          field={field}
          value={value}
          onChange={onChange}
          categoryName={categoryName}
          onContinue={onContinue}
        />
      );
    default:
      return (
        <TextStepRenderer
          field={field}
          value={value}
          onChange={onChange}
          categoryName={categoryName}
          onContinue={onContinue}
        />
      );
  }
}

export default function LocationSelectionSheet({
  isOpen,
  onClose,
  categoryId,
  categoryName,
}: LocationSelectionSheetProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const reset = useTaskFormStore((state) => state.reset);
  const setCategory = useTaskFormStore((state) => state.setCategory);

  // Fetch dynamic form fields for this category
  const { data: formFields, isLoading: isLoadingFields } = useCategoryFormFields(categoryId);

  // Filter out address fields (handled by LocationStep)
  const dynamicFields = useMemo(() => {
    if (!formFields) return [];
    return formFields.filter(
      (f) =>
        f.field_type !== 'address' &&
        !['location', 'start_address', 'end_address'].includes(f.field_key)
    );
  }, [formFields]);

  // Total steps = 1 (Location) + dynamic fields count
  const totalSteps = 1 + dynamicFields.length;

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
      setResponses({});
      reset();
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // All steps done - navigate to select-tasker with form responses
      onClose();
      router.push({
        pathname: '/(client)/select-tasker',
        params: {
          categoryId,
          categoryName,
          formResponses: JSON.stringify(responses),
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

  const handleFieldChange = (fieldKey: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // Get current dynamic field (step 2+ maps to index 0+)
  const currentFieldIndex = step - 2; // step 2 = index 0, step 3 = index 1, etc.
  const currentField = dynamicFields[currentFieldIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        className="bg-white"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: '90%',
          maxHeight: '95%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          marginHorizontal: 0,
          padding: 0,
        }}
      >
        {/* Header with Back Button, Progress Dots, and Close Button */}
        <View className="w-full px-5 pt-6 pb-4 flex-row items-center justify-between">
          {/* Back Button */}
          <RNPressable onPress={handlePrevStep} className="p-1">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </RNPressable>

          {/* Progress Dots - Dynamic count */}
          <View className="flex-row items-center justify-center gap-2">
            {Array.from({ length: Math.min(totalSteps, 10) }).map((_, index) => (
              <View
                key={index}
                className="w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: index === step - 1 ? '#C1856A' : 'transparent',
                  borderColor: index === step - 1 ? '#C1856A' : '#D1D5DB',
                }}
              />
            ))}
            {totalSteps > 10 && (
              <Text className="text-xs text-gray-500 ml-1">
                {step}/{totalSteps}
              </Text>
            )}
          </View>

          {/* Close Button */}
          <RNPressable onPress={onClose} className="p-1">
            <X size={24} color="#000000" strokeWidth={2} />
          </RNPressable>
        </View>

        {/* Step 1: Location (common for all categories) */}
        {step === 1 && <LocationStep title={categoryName} onContinue={handleNextStep} />}

        {/* Step 2+: Dynamic fields from database */}
        {step > 1 && !isLoadingFields && currentField && (
          <DynamicStepRenderer
            field={currentField}
            value={responses[currentField.field_key]}
            onChange={(val) => handleFieldChange(currentField.field_key, val)}
            categoryName={categoryName}
            onContinue={handleNextStep}
          />
        )}

        {/* Loading state */}
        {step > 1 && isLoadingFields && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#C1856A" />
            <Text className="text-sm text-gray-600 mt-3">Loading form...</Text>
          </View>
        )}

        {/* No more fields - shouldn't happen but handle gracefully */}
        {step > 1 && !isLoadingFields && !currentField && dynamicFields.length === 0 && (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-lg font-semibold text-[#30352D] mb-4 text-center">
              Ready to continue
            </Text>
            <RNPressable
              onPress={handleNextStep}
              className="w-full py-4 items-center rounded-full bg-[#C1856A]"
            >
              <Text className="text-lg font-bold text-white">Continue</Text>
            </RNPressable>
          </View>
        )}
      </ModalContent>
    </Modal>
  );
}
