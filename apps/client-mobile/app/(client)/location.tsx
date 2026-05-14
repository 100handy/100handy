import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { Input, InputField } from '@/components/ui/input'; import { Button, ButtonText } from '@/components/ui/button'; import { ChevronLeft } from 'lucide-react-native'; import { useRouter } from 'expo-router'; import { LocationAutocomplete, type LocationResult, type AddressComponents } from '@/components/location'; import { useLocationStore } from '@shared/store';
import { goBackOrReplace } from '@/lib/navigation';

export default function LocationScreen() {
  const router = useRouter();
  const { location, setLocation } = useLocationStore();

  const [streetAddress, setStreetAddress] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [addressComponents, setAddressComponents] = useState<AddressComponents | null>(null);
  const [selectedLatitude, setSelectedLatitude] = useState<number | undefined>();
  const [selectedLongitude, setSelectedLongitude] = useState<number | undefined>();

  // Load existing location on mount
  useEffect(() => {
    if (location) {
      setStreetAddress(location.streetAddress || '');
      setUnitNumber(location.unitNumber || '');
      setSelectedPlaceId(location.placeId || null);
      setSelectedLatitude(location.latitude);
      setSelectedLongitude(location.longitude);
    }
  }, [location]);

  const handleSelectLocation = (locationData: LocationResult) => {
    setSelectedPlaceId(locationData.place_id);
    if (locationData.addressComponents) {
      setAddressComponents(locationData.addressComponents);
      setSelectedLatitude(locationData.addressComponents.latitude);
      setSelectedLongitude(locationData.addressComponents.longitude);
    }
  };

  const handleSave = () => {
    // Use structured address components from Google Places API when available
    let city = '';
    let country = '';
    let postcode = '';

    if (addressComponents) {
      city = addressComponents.city;
      country = addressComponents.country;
      postcode = addressComponents.postcode;
    } else {
      // Fallback: parse from formatted address string (less reliable)
      const addressParts = streetAddress.split(',').map(part => part.trim());
      country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
      city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
    }

    setLocation({
      streetAddress: addressComponents?.streetAddress || streetAddress,
      unitNumber,
      placeId: selectedPlaceId || undefined,
      city,
      country,
      postalCode: postcode,
      formattedAddress: streetAddress,
      latitude: selectedLatitude,
      longitude: selectedLongitude,
    });

    goBackOrReplace(router, '/(client)/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-[18px] text-[#30352D]">
          Location
        </Text>
        <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="w-7" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col px-5 pt-6 pb-8">
          {/* Street Address with Autocomplete */}
          <View className="flex-col mb-6">
            <LocationAutocomplete
              value={streetAddress}
              onChangeText={setStreetAddress}
              onSelectLocation={handleSelectLocation}
              label="Street address"
              placeholder="Enter your address"
            />
          </View>

          {/* Optional Unit Number */}
          <View className="flex-col mb-8">
            <Text className="font-worksans text-[14px] text-[#30352D] mb-2">
              Optional unit or apt #
            </Text>
            <Input
              variant="outline"
              size="lg"
              className="rounded-lg border-[#E5E5E5]"
            >
              <InputField
                value={unitNumber}
                onChangeText={setUnitNumber}
                placeholder=""
                placeholderTextColor="#6B6B6B"
                style={{ color: '#30352D', fontSize: 15 }}
              />
            </Input>
          </View>

          {/* Current/Default Section */}
          {location && location.streetAddress && (
            <View className="flex-col">
              <Text className="font-worksans text-[14px] text-[#30352D] mb-3">
                Current Location
              </Text>
              <Text className="font-worksans text-[16px] text-[#30352D]">
                {location.formattedAddress || location.streetAddress}
              </Text>
              {location.unitNumber && (
                <Text className="font-worksans text-[14px] text-[#6B6B6B] mt-1">
                  Unit/Apt: {location.unitNumber}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="flex-col px-5 pb-6">
        <Button
          onPress={handleSave}
          className="bg-[#4A5347] rounded-full"
          size="lg"
        >
          <ButtonText className="font-worksans-semibold text-white text-[16px]">
            Save
          </ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
}
