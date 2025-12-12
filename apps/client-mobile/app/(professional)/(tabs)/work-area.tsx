import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polygon, LatLng, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Hand, X } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { useWorkArea, useSaveWorkArea, type Coordinate } from '@shared/supabase';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function WorkAreaTab() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<LatLng[]>([]);

  const mapRef = useRef<MapView>(null);

  // Query hooks for persistence
  const { data: existingWorkArea, isLoading: isLoadingWorkArea } = useWorkArea();
  const { mutate: saveWorkAreaMutation, isPending: isSaving } = useSaveWorkArea();

  // PanResponder for handling touch gestures on the map
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDrawing(true);
        setDrawnCoordinates([]);
        setIsReviewing(false);
      },
      onPanResponderMove: async (event) => {
        const { locationX, locationY } = event.nativeEvent;
        if (mapRef.current) {
          try {
            const coordinate = await mapRef.current.coordinateForPoint({
              x: locationX,
              y: locationY
            });

            if (coordinate) {
              setDrawnCoordinates(prev => [...prev, coordinate]);
            }
          } catch (error) {
            console.error('Error converting point:', error);
          }
        }
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        setDrawnCoordinates(prev => {
          if (prev.length > 2) {
            setIsReviewing(true);
            return [...prev, prev[0]];
          }
          return [];
        });
      },
    })
  ).current;

  // Load existing work area coordinates
  useEffect(() => {
    if (existingWorkArea?.coordinates && existingWorkArea.coordinates.length > 0) {
      const coords: LatLng[] = existingWorkArea.coordinates.map((c: Coordinate) => ({
        latitude: c.latitude,
        longitude: c.longitude,
      }));
      setDrawnCoordinates(coords);
      setIsReviewing(true);
    }
  }, [existingWorkArea]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        const defaultRegion = {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(defaultRegion);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const initialRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setRegion(initialRegion);
    })();
  }, []);

  const handleSave = () => {
    if (drawnCoordinates.length > 2) {
      const coordinates: Coordinate[] = drawnCoordinates.map(coord => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));

      saveWorkAreaMutation(
        { coordinates },
        {
          onError: (error) => {
            console.error('Failed to save work area:', error);
          },
        }
      );
    }
  };

  const handleClear = () => {
    setDrawnCoordinates([]);
    setIsDrawingMode(false);
    setIsReviewing(false);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(true);
    setDrawnCoordinates([]);
    setIsReviewing(false);
  };

  if (!region || isLoadingWorkArea) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A5347" />
          <Text className="text-[#30352D] text-lg mt-4 font-worksans">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView edges={['top']} className={`z-10 ${isReviewing ? 'bg-[#E8F5E9]' : 'bg-white'}`}>
        <View className="px-6 py-4 flex-row items-center justify-center">
          <Text className="text-[#30352D] text-lg font-worksans-bold">
            {isReviewing ? 'Reviewing work area' : 'Set Work Area'}
          </Text>
        </View>
      </SafeAreaView>

      {/* Map */}
      <View style={StyleSheet.absoluteFillObject} className="top-[100px]">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          scrollEnabled={!isDrawingMode}
          zoomEnabled={!isDrawingMode}
          rotateEnabled={!isDrawingMode}
          pitchEnabled={!isDrawingMode}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {drawnCoordinates.length > 0 && (
            <Polygon
              coordinates={drawnCoordinates}
              strokeColor="#1E88E5"
              fillColor={isReviewing ? "rgba(30, 136, 229, 0.2)" : "rgba(30, 136, 229, 0.1)"}
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {/* Drawing Overlay */}
        {isDrawingMode && !isReviewing && (
          <View
            style={StyleSheet.absoluteFillObject}
            {...panResponder.panHandlers}
          />
        )}
      </View>

      {/* Controls - positioned above tab bar */}
      <View className="absolute bottom-[90px] left-0 right-0 p-6 pointer-events-box-none">
        {/* Floating Action Buttons */}
        {!isReviewing && (
          <View className="flex-row justify-end mb-4">
            {isDrawingMode ? (
              <View className="bg-white rounded-full shadow-lg px-6 py-3 flex-row items-center gap-2">
                <Text className="text-[#30352D] font-worksans-medium">Draw on map</Text>
              </View>
            ) : (
              <Pressable
                onPress={toggleDrawingMode}
                className="bg-white rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2"
              >
                <Hand size={20} color="#4A5347" />
                <Text className="text-[#4A5347] font-worksans-bold text-base">Draw area</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Clear Button (when area is drawn) */}
        {isReviewing && (
          <View className="flex-row justify-end mb-4">
            <Pressable
              onPress={handleClear}
              className="bg-white rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2"
            >
              <X size={20} color="#4A5347" />
              <Text className="text-[#4A5347] font-worksans-bold text-base">Clear</Text>
            </Pressable>
          </View>
        )}

        {/* Save Button */}
        <Button
          className={`rounded-full shadow-sm h-[56px] ${isReviewing && !isSaving ? 'bg-[#4A5347]' : 'bg-gray-300'}`}
          onPress={handleSave}
          isDisabled={!isReviewing || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ButtonText className="text-white text-lg font-worksans-bold">
              Save work area
            </ButtonText>
          )}
        </Button>
      </View>
    </View>
  );
}
