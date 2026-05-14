import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { router } from 'expo-router'; import { ChevronLeft } from 'lucide-react-native'; import { useProfessionalProfileStore } from '@shared/store';
import { goBackOrReplace } from '@/lib/navigation';
import { useToast } from '@/components/ui/toast';

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
  const toast = useToast();

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
    try {
      await setVehicles(selectedVehicles);
      toast.success('Saved', 'Your vehicles have been updated');
      goBackOrReplace(router, '/(professional)/(tabs)/profile');
    } catch (error) {
      toast.error('Error', 'Failed to save vehicles');
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
          Vehicles
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-col px-5 py-6 gap-6">
          {/* Info Section */}
          <View className="flex-col gap-2">
            <Text className="text-xl font-bold text-brand-dark" style={{ fontFamily: 'WorkSans_700Bold' }}>
              How do you get around?
            </Text>
          </View>

          {/* Subtitle */}
          <Text className="text-sm text-[#666666]" style={{ fontFamily: 'WorkSans_400Regular' }}>
            Pick all that apply
          </Text>

          {/* Vehicles List */}
          <View className="flex-col gap-3">
            {VEHICLES_LIST.map((vehicle) => (
              <SelectableVehicleItem
                key={vehicle.name}
                vehicle={vehicle}
                isSelected={selectedVehicles.includes(vehicle.name)}
                onPress={() => toggleVehicle(vehicle.name)}
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

interface SelectableVehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onPress: () => void;
}

function SelectableVehicleItem({ vehicle, isSelected, onPress }: SelectableVehicleItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-4 py-3.5 ${isSelected ? 'bg-brand-terracotta/10 border border-brand-terracotta' : 'bg-[#F5F5F5]'}`}
    >
      <View className="flex-col gap-1">
        <Text 
          className="text-base font-medium text-brand-dark"
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
      </View>
    </Pressable>
  );
}
