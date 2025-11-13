import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Edit, Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLocationStore } from '@shared/supabase';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';

type TaskSize = 'small' | 'medium' | 'large';
type VehicleType = 'not-needed' | 'car' | 'van';

const taskSizeOptions: { value: TaskSize; label: string }[] = [
  { value: 'small', label: 'Small (1 hour)' },
  { value: 'medium', label: 'Medium (2-3 hours)' },
  { value: 'large', label: 'Large (4+ hours)' },
];

const vehicleOptions: { value: VehicleType; label: string }[] = [
  { value: 'not-needed', label: 'Not needed' },
  { value: 'car', label: 'Car' },
  { value: 'van', label: 'Van' },
];

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const location = useLocationStore((state) => state.location);

  // Task details from params
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;

  // Editable state
  const [taskSize, setTaskSize] = useState<TaskSize>((params.taskSize as TaskSize) || 'medium');
  const [vehicleRequirement, setVehicleRequirement] = useState<VehicleType>((params.vehicleRequirement as VehicleType) || 'not-needed');
  const [taskDetails, setTaskDetails] = useState((params.taskDetails as string) || '');

  // Modal state
  const [showTaskSizeSheet, setShowTaskSizeSheet] = useState(false);
  const [showVehicleSheet, setShowVehicleSheet] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);

  const handleContinue = () => {
    // Navigate back to confirm booking with updated values
    router.push({
      pathname: '/(client)/confirm-booking',
      params: {
        taskerId,
        categoryId,
        categoryName,
        taskSize,
        vehicleRequirement,
        taskDetails: taskDetails.trim() || '',
        selectedDate,
        selectedTime,
      },
    });
  };

  const formatAddress = () => {
    if (!location?.streetAddress) return 'No address set';

    let address = location.streetAddress;
    if (location.unitNumber) address += `, ${location.unitNumber}`;
    if (location.city) address += `, ${location.city}`;
    if (location.postalCode) address += ` ${location.postalCode}`;
    if (location.country) address += `, ${location.country}`;

    return address;
  };

  const getTaskSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small (1 hour)';
      case 'medium': return 'Medium (2-3 hours)';
      case 'large': return 'Large (4+ hours)';
      default: return size;
    }
  };

  const getVehicleLabel = (req: string) => {
    switch (req) {
      case 'not-needed': return 'Not needed';
      case 'car': return 'Car';
      case 'van': return 'Van';
      default: return req;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            {categoryName}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-base" style={{ color: '#C1856A' }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col py-6">
          {/* Task Address */}
          <Pressable
            className="flex-col px-5 py-4 border-b border-gray-200"
            onPress={() => router.push('/(client)/location')}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-col flex-1 pr-3">
                <Text className="text-sm text-gray-600 mb-2">
                  Task Address
                </Text>
                <Text className="text-base font-semibold text-[#30352D]">
                  {formatAddress()}
                </Text>
              </View>
              <Edit size={20} color="#000000" strokeWidth={1.5} />
            </View>
          </Pressable>

          {/* Task Size */}
          <Pressable
            className="flex-col px-5 py-4 border-b border-gray-200"
            onPress={() => setShowTaskSizeSheet(true)}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-col flex-1 pr-3">
                <Text className="text-sm text-gray-600 mb-2">
                  Task Size
                </Text>
                <Text className="text-base font-semibold text-[#30352D]">
                  {getTaskSizeLabel(taskSize)}
                </Text>
              </View>
              <Edit size={20} color="#000000" strokeWidth={1.5} />
            </View>
          </Pressable>

          {/* Vehicle Requirement */}
          <Pressable
            className="flex-col px-5 py-4 border-b border-gray-200"
            onPress={() => setShowVehicleSheet(true)}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-col flex-1 pr-3">
                <Text className="text-sm text-gray-600 mb-2">
                  Vehicle Requirement
                </Text>
                <Text className="text-base font-semibold text-[#30352D]">
                  {getVehicleLabel(vehicleRequirement)}
                </Text>
              </View>
              <Edit size={20} color="#000000" strokeWidth={1.5} />
            </View>
          </Pressable>

          {/* Additional Details */}
          <Pressable
            className="flex-col px-5 py-4 border-b border-gray-200"
            onPress={() => setShowDetailsSheet(true)}
          >
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-sm text-gray-600">
                Extra services
              </Text>
              <Edit size={20} color="#000000" strokeWidth={1.5} />
            </View>
            {taskDetails ? (
              <Text className="text-base text-[#30352D]">
                {taskDetails}
              </Text>
            ) : (
              <Text className="text-base text-gray-400">
                No additional details
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Continue Button */}
      <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleContinue}
          className="w-full py-4 rounded-full items-center"
          style={{ backgroundColor: '#C1856A' }}
        >
          <Text className="text-base font-semibold text-white">
            Continue
          </Text>
        </Pressable>
      </View>

      {/* Task Size Selection Sheet */}
      <Modal isOpen={showTaskSizeSheet} onClose={() => setShowTaskSizeSheet(false)} size="full">
        <ModalBackdrop />
        <ModalContent
          size="full"
          style={{
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '50%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            margin: 0,
            marginHorizontal: 0,
            padding: 0,
          }}
        >
          <ModalBody style={{ padding: 0 }}>
            <View className="w-full pb-4 pt-6 px-5 border-b border-gray-200">
              <Text className="text-center text-xl font-medium" style={{ color: '#333A31' }}>
                Select Task Size
              </Text>
            </View>
            <View className="flex-col w-full">
              {taskSizeOptions.map((option, index) => {
                const isSelected = taskSize === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setTaskSize(option.value);
                      setShowTaskSizeSheet(false);
                    }}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: index < taskSizeOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#E5E7EB',
                    }}
                  >
                    <View className="flex-row flex-1 items-center justify-between">
                      <Text style={{ color: '#333A31', fontWeight: '400', fontSize: 16 }}>
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Check size={20} color="#333A31" strokeWidth={2.5} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Vehicle Requirement Selection Sheet */}
      <Modal isOpen={showVehicleSheet} onClose={() => setShowVehicleSheet(false)} size="full">
        <ModalBackdrop />
        <ModalContent
          size="full"
          style={{
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '50%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            margin: 0,
            marginHorizontal: 0,
            padding: 0,
          }}
        >
          <ModalBody style={{ padding: 0 }}>
            <View className="w-full pb-4 pt-6 px-5 border-b border-gray-200">
              <Text className="text-center text-xl font-medium" style={{ color: '#333A31' }}>
                Select Vehicle Requirement
              </Text>
            </View>
            <View className="flex-col w-full">
              {vehicleOptions.map((option, index) => {
                const isSelected = vehicleRequirement === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setVehicleRequirement(option.value);
                      setShowVehicleSheet(false);
                    }}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderBottomWidth: index < vehicleOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#E5E7EB',
                    }}
                  >
                    <View className="flex-row flex-1 items-center justify-between">
                      <Text style={{ color: '#333A31', fontWeight: '400', fontSize: 16 }}>
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Check size={20} color="#333A31" strokeWidth={2.5} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Extra Services Details Sheet */}
      <Modal isOpen={showDetailsSheet} onClose={() => setShowDetailsSheet(false)} size="full">
        <ModalBackdrop />
        <ModalContent
          size="full"
          style={{
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '70%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            margin: 0,
            marginHorizontal: 0,
            padding: 0,
          }}
        >
          <ModalBody style={{ padding: 0 }}>
            <View className="w-full pb-4 pt-6 px-5 border-b border-gray-200">
              <Text className="text-center text-xl font-medium" style={{ color: '#333A31' }}>
                Extra Services
              </Text>
            </View>
            <View className="flex-col w-full p-5">
              <Text className="text-sm text-gray-600 mb-4">
                Add any additional details or requirements for this task
              </Text>
              <TextInput
                value={taskDetails}
                onChangeText={setTaskDetails}
                placeholder="For example, what supplies are needed, where to park, or timing restrictions."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                className="bg-gray-50 rounded-lg px-4 py-3 text-base text-[#30352D] mb-4"
                style={{
                  minHeight: 200,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              />
              <Pressable
                onPress={() => setShowDetailsSheet(false)}
                className="w-full py-4 rounded-full items-center"
                style={{ backgroundColor: '#C1856A' }}
              >
                <Text className="text-base font-semibold text-white">
                  Done
                </Text>
              </Pressable>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}
