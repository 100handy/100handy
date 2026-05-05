import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { countryCodeToFlagEmoji } from '@/lib/welcome-country';
import { getCountriesAsync } from 'react-native-country-picker-modal/lib/CountryService';
import { FlagType, type Country, type CountryCode } from 'react-native-country-picker-modal/lib/types';

interface CountryCodePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryCode: CountryCode;
  onSelectCountry: (country: Country) => void;
}

export default function CountryCodePickerSheet({
  isOpen,
  onClose,
  selectedCountryCode,
  onSelectCountry,
}: CountryCodePickerSheetProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen || countries.length > 0) {
      return;
    }

    let isMounted = true;

    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const data = await getCountriesAsync(FlagType.EMOJI, 'common');
        if (isMounted) {
          setCountries(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCountries();

    return () => {
      isMounted = false;
    };
  }, [countries.length, isOpen]);

  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter((country) => {
      const name = typeof country.name === 'string' ? country.name : '';
      const callingCode = country.callingCode[0] ?? '';
      return (
        name.toLowerCase().includes(normalizedQuery) ||
        country.cca2.toLowerCase().includes(normalizedQuery) ||
        callingCode.includes(normalizedQuery.replace('+', ''))
      );
    });
  }, [countries, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <ModalBackdrop />
      <ModalContent
        size="full"
        className="bg-white"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '70%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          margin: 0,
          padding: 0,
        }}
      >
        <View className="px-5 pt-4 pb-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-worksans-bold" style={{ color: '#30352D' }}>
              Select country
            </Text>
            <Pressable onPress={handleClose} className="p-1">
              <ChevronDown size={18} color="#30352D" />
            </Pressable>
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search country or calling code"
            placeholderTextColor="#9CA3AF"
            className="rounded-xl border border-gray-200 px-4 py-3 font-worksans text-[15px]"
            style={{ color: '#30352D' }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator color="#C1856A" />
          </View>
        ) : (
          <ScrollView
            className="max-h-[520px]"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCountries.map((country) => {
              const isSelected = country.cca2 === selectedCountryCode;
              const countryName = typeof country.name === 'string' ? country.name : country.cca2;
              const primaryCallingCode = country.callingCode[0] ?? '';

              return (
                <Pressable
                  key={country.cca2}
                  onPress={() => {
                    onSelectCountry(country);
                    handleClose();
                  }}
                  className="px-5 py-4 border-b border-gray-100"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-[20px] mr-3">
                        {countryCodeToFlagEmoji(country.cca2)}
                      </Text>
                      <View className="flex-1">
                        <Text className="font-worksans-medium text-[15px]" style={{ color: '#30352D' }}>
                          {countryName}
                        </Text>
                        <Text className="font-worksans text-[13px] mt-0.5" style={{ color: '#6B6B6B' }}>
                          +{primaryCallingCode}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Check size={18} color="#C1856A" strokeWidth={2.5} />}
                  </View>
                </Pressable>
              );
            })}

            {!filteredCountries.length && (
              <View className="px-5 py-8 items-center">
                <Text className="font-worksans text-[14px]" style={{ color: '#6B6B6B' }}>
                  No countries found.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </ModalContent>
    </Modal>
  );
}
