import React, { useState, useRef, useEffect } from 'react';
import { useSaveWorkArea, type Coordinate } from '@shared/query';
import { View, StyleSheet, Dimensions, PanResponder, Text, Pressable, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import MapView, { Polygon, LatLng, Region } from 'react-native-maps'; import { router } from 'expo-router'; import { ArrowLeft, Hand, Minus, Plus, X } from 'lucide-react-native'; import { Button, ButtonText } from '@/components/ui/button'; import { useWorkArea } from '@shared/query';
import { useToast } from '@/components/ui/toast';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONDON_REGION: Region = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

function getRegionForCoordinates(coordinates: LatLng[]): Region {
  const latitudes = coordinates.map((coord) => coord.latitude);
  const longitudes = coordinates.map((coord) => coord.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.6, 0.01),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.6, 0.01),
  };
}

export default function SetWorkAreaScreen() {
  const toast = useToast();
  const [region, setRegion] = useState<Region>(LONDON_REGION);

  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false); // Toggle for "Draw area" mode
  const [isReviewing, setIsReviewing] = useState(false); // Drawing finished, showing review UI
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
        setDrawnCoordinates([]); // Clear previous drawing when starting new one
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
        setDrawnCoordinates(prev => {
          if (prev.length > 2) {
            setIsReviewing(true);
            return [...prev, prev[0]]; // Connect back to start
          }
          return []; // Invalid drawing, clear it
        });
      },
    })
  ).current;

  // Load existing work area coordinates
  useEffect(() => {
    if (existingWorkArea?.coordinates && existingWorkArea.coordinates.length > 0) {
      // Transform Coordinate[] to LatLng[]
      const coords: LatLng[] = existingWorkArea.coordinates.map((c: Coordinate) => ({
        latitude: c.latitude,
        longitude: c.longitude,
      }));
      setDrawnCoordinates(coords);
      setIsReviewing(true);
      const nextRegion = getRegionForCoordinates(coords);
      setRegion(nextRegion);
      requestAnimationFrame(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 120, right: 60, bottom: 180, left: 60 },
          animated: false,
        });
      });
    }
  }, [existingWorkArea]);

  const handleSave = () => {
    if (drawnCoordinates.length > 2) {
      // Transform LatLng[] to Coordinate[] for API
      const coordinates: Coordinate[] = drawnCoordinates.map(coord => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));

      saveWorkAreaMutation(
        { coordinates },
        {
          onSuccess: () => {
            toast.success('Saved', 'Work area updated');
            router.push('/(professional)/(tabs)/dashboard');
          },
          onError: (error) => {
            console.error('Failed to save work area:', error);
            toast.error(
              'Save failed',
              error instanceof Error ? error.message : 'Please try again'
            );
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/(tabs)/work-area');
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const scale = direction === 'in' ? 0.5 : 2;
    const nextRegion: Region = {
      ...region,
      latitudeDelta: Math.max(0.002, Math.min(1, region.latitudeDelta * scale)),
      longitudeDelta: Math.max(0.002, Math.min(1, region.longitudeDelta * scale)),
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 200);
  };

  if (isLoadingWorkArea) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
          <Text className="text-brand-dark-alt text-lg mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView edges={['top']} className={`z-10 ${isReviewing ? 'bg-green-50' : 'bg-transparent'}`}>
        <View className="px-6 py-4 flex-row items-center justify-between">
          {!isReviewing ? (
            <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm">
              <ArrowLeft size={24} color="#30352D" />
            </Pressable>
          ) : (
            <View /> // Spacer
          )}

          {isReviewing && (
            <Text className="text-brand-dark-alt text-lg font-worksans-medium">Reviewing work area</Text>
          )}

          <View className="w-10" />
        </View>
      </SafeAreaView>

      {/* Map */}
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          scrollEnabled={!isDrawingMode} // Disable map scroll when drawing mode is active
          zoomEnabled={!isDrawingMode}
          rotateEnabled={!isDrawingMode}
          pitchEnabled={!isDrawingMode}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {drawnCoordinates.length > 0 && (
            // Use Polygon for finished shape, Polyline for active drawing
            isReviewing ? (
              <Polygon
                coordinates={drawnCoordinates}
                strokeColor="#1E88E5"
                fillColor="rgba(30, 136, 229, 0.2)"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
              />
            ) : (
              <Polygon
                // Using Polygon with transparent fill for drawing phase to show the line clearly
                // Or actually, Polyline is better but Polygon is imported. Let's stick to Polygon but maybe different style?
                // Actually, the user complained about visibility. 
                // Let's use the same style but ensure it updates.
                coordinates={drawnCoordinates}
                strokeColor="#1E88E5"
                fillColor="rgba(30, 136, 229, 0.1)"
                strokeWidth={3}
              />
            )
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

      <View className="absolute right-5 top-32 rounded-full bg-white shadow-lg overflow-hidden">
        <Pressable
          accessibilityLabel="Zoom in"
          onPress={() => handleZoom('in')}
          className="w-12 h-12 items-center justify-center border-b border-gray-100"
        >
          <Plus size={22} color="#30352D" />
        </Pressable>
        <Pressable
          accessibilityLabel="Zoom out"
          onPress={() => handleZoom('out')}
          className="w-12 h-12 items-center justify-center"
        >
          <Minus size={22} color="#30352D" />
        </Pressable>
      </View>

      {/* Controls */}
      <SafeAreaView
        edges={['bottom']}
        className="absolute bottom-0 left-0 right-0 px-4 pt-2 pb-3 pointer-events-box-none"
      >
        <View className="bg-white/96 rounded-[24px] px-4 pt-3 pb-2 shadow-lg">

        {/* Floating Action Buttons */}
        {!isReviewing && (
          <View className="flex-row justify-end mb-4">
            {isDrawingMode ? (
              <View className="bg-white rounded-full shadow-lg px-6 py-3 flex-row items-center gap-2">
                <Text className="text-brand-dark-alt font-worksans-medium">Draw on map</Text>
              </View>
            ) : (
              <Pressable
                onPress={toggleDrawingMode}
                className="bg-white rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2"
              >
                <Hand size={20} color="#047857" />
                <Text className="text-emerald-700 font-worksans-bold text-base">Draw area</Text>
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
              <X size={20} color="#047857" />
              <Text className="text-emerald-700 font-worksans-bold text-base">Clear</Text>
            </Pressable>
          </View>
        )}

        {/* Save Button */}
        <Button
          className={`rounded-full shadow-sm h-[56px] ${isReviewing && !isSaving ? 'bg-emerald-700' : 'bg-gray-300'}`}
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
      </SafeAreaView>
    </View>
  );
}
