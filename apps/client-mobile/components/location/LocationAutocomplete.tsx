import React, { useState, useCallback } from 'react';
import { FlatList, ActivityIndicator, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react-native';
import debounce from 'lodash/debounce';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface LocationAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: PlacePrediction) => void;
  placeholder?: string;
  label?: string;
  showClearButton?: boolean;
  inputClassName?: string;
}

export function LocationAutocomplete({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = 'Enter your address',
  label,
  showClearButton = true,
  inputClassName,
}: LocationAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not configured');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&types=address`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        setPredictions(data.predictions);
        setShowSuggestions(true);
      } else {
        setPredictions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPredictions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((text: string) => searchPlaces(text), 500),
    []
  );

  const handleTextChange = (text: string) => {
    onChangeText(text);
    debouncedSearch(text);
  };

  const handleSelectPrediction = (prediction: PlacePrediction) => {
    onSelectLocation(prediction);
    onChangeText(prediction.description);
    setPredictions([]);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChangeText('');
    setPredictions([]);
    setShowSuggestions(false);
  };

  return (
    <VStack>
      {label && (
        <Text className="font-worksans text-[14px] text-[#30352D] mb-2">
          {label}
        </Text>
      )}

      <Input
        variant="outline"
        size={inputClassName ? undefined : "lg"}
        className={inputClassName || "rounded-lg border-[#E5E5E5]"}
      >
        <InputField
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={placeholder ? "#6B6B6B" : "#9CA3AF"}
          className="font-worksans text-[15px]"
          style={{ color: '#30352D', fontSize: 15 }}
          autoComplete="street-address"
        />
        {loading ? (
          <InputSlot className="pr-3">
            <ActivityIndicator size="small" color="#6B6B6B" />
          </InputSlot>
        ) : showClearButton && value ? (
          <InputSlot className="pr-3">
            <Pressable onPress={handleClear}>
              <X size={20} color="#6B6B6B" strokeWidth={2} />
            </Pressable>
          </InputSlot>
        ) : null}
      </Input>

      {/* Suggestions List */}
      {showSuggestions && predictions.length > 0 && (
        <VStack
          className="mt-2 bg-white border border-[#E5E5E5] rounded-lg overflow-hidden"
          style={{
            maxHeight: 250,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              android: {
                elevation: 3,
              },
            }),
          }}
        >
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => handleSelectPrediction(item)}
                className={`px-4 py-3 ${
                  index !== predictions.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                }`}
              >
                <HStack className="items-start gap-3">
                  <MapPin size={18} color="#6B6B6B" strokeWidth={2} style={{ marginTop: 2 }} />
                  <VStack className="flex-1">
                    <Text className="font-worksans-semibold text-[15px] text-[#30352D] mb-0.5">
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text className="font-worksans text-[13px] text-[#6B6B6B]">
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            )}
          />
        </VStack>
      )}
    </VStack>
  );
}
