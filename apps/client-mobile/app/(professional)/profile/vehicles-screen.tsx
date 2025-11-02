import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/store';

interface Vehicle {
  name: string;
  description: string;
}

const VEHICLES_LIST: Vehicle[] = [
  {
    name: 'Bicycle/Scooter/Motorcycle',
    description: 'For transporting small or single items.',
  },
  {
    name: 'Motorcycle',
    description: 'For transporting small or single items.',
  },
  {
    name: 'Car',
    description: 'For transporting medium-sized items.',
  },
  {
    name: 'Minivan/SUV',
    description: 'For transporting medium-sized items.',
  },
  {
    name: 'Full-size Van',
    description: 'For transporting multiple medium-sized items and large single items in one or multiple trips.',
  },
  {
    name: 'Moving Truck',
    description: 'For transporting multiple large-sized items in a single trip.',
  },
];

export default function VehiclesScreen() {
  const { vehicles, setVehicles, loadProfile } = useProfessionalProfileStore();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync local state with store
  useEffect(() => {
    setSelectedVehicles(vehicles);
  }, [vehicles]);

  const toggleVehicle = (vehicleName: string) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleName)
        ? prev.filter(v => v !== vehicleName)
        : [...prev, vehicleName]
    );
  };

  const handleSave = async () => {
    await setVehicles(selectedVehicles);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HStack className="items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-[#333A31] pr-6" style={{ fontFamily: 'WorkSans_600SemiBold' }}>
          Vehicles
        </Text>
      </HStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-5 py-6 gap-6">
          {/* Info Section */}
          <VStack className="gap-2">
            <Text className="text-xl font-bold text-[#333A31]" style={{ fontFamily: 'WorkSans_700Bold' }}>
              How do you get around?
            </Text>
          </VStack>

          {/* Subtitle */}
          <Text className="text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
            Pick all that apply
          </Text>

          {/* Vehicles List */}
          <VStack className="gap-3">
            {VEHICLES_LIST.map((vehicle) => (
              <SelectableVehicleItem
                key={vehicle.name}
                vehicle={vehicle}
                isSelected={selectedVehicles.includes(vehicle.name)}
                onPress={() => toggleVehicle(vehicle.name)}
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

interface SelectableVehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onPress: () => void;
}

function SelectableVehicleItem({ vehicle, isSelected, onPress }: SelectableVehicleItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-4 py-3.5 ${isSelected ? 'bg-[#D17852]/10 border border-[#D17852]' : 'bg-[#F5F5F5]'}`}
    >
      <VStack className="gap-1">
        <Text 
          className="text-base font-medium text-[#333A31]"
          style={{ fontFamily: 'WorkSans_500Medium' }}
        >
          {vehicle.name}
        </Text>
        <Text 
          className="text-sm text-[#666666]"
          style={{ fontFamily: 'WorkSans_400Regular' }}
        >
          {vehicle.description}
        </Text>
      </VStack>
    </Pressable>
  );
}