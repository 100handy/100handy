import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, Region, Polygon, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { ArrowLeft, MapPin, Plus, Minus, Pencil, Circle as CircleIcon, Trash2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Radius options in miles
const MIN_RADIUS_MILES = 1;
const MAX_RADIUS_MILES = 50;
const DEFAULT_RADIUS_MILES = 10;

// Convert miles to meters for the map circle
const milesToMeters = (miles: number) => miles * 1609.34;

type DrawMode = 'circle' | 'draw';

export default function SetWorkAreaScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [centerCoordinate, setCenterCoordinate] = useState<LatLng | null>(null);
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES);
  const [drawMode, setDrawMode] = useState<DrawMode>('circle');

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<LatLng[]>([]);
  const [currentDrawingPath, setCurrentDrawingPath] = useState<LatLng[]>([]);

  const mapRef = useRef<MapView>(null);

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
        setCenterCoordinate({
          latitude: defaultRegion.latitude,
          longitude: defaultRegion.longitude,
        });
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
      setCenterCoordinate({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
      });
    })();
  }, []);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    if (drawMode === 'circle') {
      setCenterCoordinate({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
    }
  };

  // Convert screen coordinates to map coordinates
  const screenToMapCoordinate = async (x: number, y: number): Promise<LatLng | null> => {
    if (mapRef.current) {
      try {
        const coordinate = await mapRef.current.coordinateForPoint({ x, y });
        return coordinate;
      } catch (error) {
        console.error('Error converting screen to map coordinate:', error);
        return null;
      }
    }
    return null;
  };

  const handleMapPress = (e: any) => {
    if (drawMode === 'draw' && isDrawing) {
      const { coordinate } = e.nativeEvent;
      console.log('Tap detected at:', coordinate);
      setCurrentDrawingPath((prev) => {
        const newPath = [...prev, coordinate];
        console.log('Total points:', newPath.length);
        return newPath;
      });
    }
  };

  const startDrawing = () => {
    console.log('Starting drawing mode');
    setIsDrawing(true);
    setCurrentDrawingPath([]);
    setDrawnCoordinates([]); // Clear any previous drawing
  };

  const finishDrawing = () => {
    if (currentDrawingPath.length > 2) {
      // Close the polygon by connecting to the first point
      setDrawnCoordinates([...currentDrawingPath, currentDrawingPath[0]]);
    }
    setIsDrawing(false);
    setCurrentDrawingPath([]);
  };

  const clearDrawing = () => {
    setDrawnCoordinates([]);
    setCurrentDrawingPath([]);
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (drawMode === 'circle' && centerCoordinate) {
      console.log('Saving circular work area:', {
        latitude: centerCoordinate.latitude,
        longitude: centerCoordinate.longitude,
        radiusMiles: radiusMiles,
        radiusMeters: milesToMeters(radiusMiles),
        type: 'circle',
      });
    } else if (drawMode === 'draw' && drawnCoordinates.length > 0) {
      console.log('Saving custom work area:', {
        coordinates: drawnCoordinates,
        type: 'polygon',
      });
    }
    router.push('/(professional)/(tabs)/dashboard');
  };

  const increaseRadius = () => {
    setRadiusMiles((prev) => Math.min(prev + 1, MAX_RADIUS_MILES));
  };

  const decreaseRadius = () => {
    setRadiusMiles((prev) => Math.max(prev - 1, MIN_RADIUS_MILES));
  };

  const switchToCircleMode = () => {
    setDrawMode('circle');
    clearDrawing();
  };

  const switchToDrawMode = () => {
    setDrawMode('draw');
  };

  if (!region) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 items-center justify-center">
          <Text className="text-[#30352D] text-lg">Loading map...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const hasValidArea =
    (drawMode === 'circle' && centerCoordinate) ||
    (drawMode === 'draw' && drawnCoordinates.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Box className="flex-1">
        {/* Header */}
        <Box className="bg-white px-6 py-4 border-b border-gray-200 z-10">
          <HStack className="items-center justify-between">
            <Pressable onPress={() => router.push('/(professional)/(tabs)/dashboard')}>
              <ArrowLeft size={24} color="#30352D" />
            </Pressable>
            <Text className="text-[#30352D] text-lg font-bold">Set Work Area</Text>
            <Box className="w-6" />
          </HStack>
        </Box>

        {/* Mode Selector */}
        <Box className="bg-[#F5F5F5] px-6 py-4 border-b border-gray-200">
          <HStack className="gap-3">
            <Pressable
              onPress={switchToCircleMode}
              className={`flex-1 rounded-xl py-3 items-center ${
                drawMode === 'circle' ? 'bg-[#C1856A]' : 'bg-white border border-gray-300'
              }`}
            >
              <HStack className="items-center gap-2">
                <CircleIcon
                  size={20}
                  color={drawMode === 'circle' ? 'white' : '#30352D'}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm font-bold ${
                    drawMode === 'circle' ? 'text-white' : 'text-[#30352D]'
                  }`}
                >
                  Radius
                </Text>
              </HStack>
            </Pressable>

            <Pressable
              onPress={switchToDrawMode}
              className={`flex-1 rounded-xl py-3 items-center ${
                drawMode === 'draw' ? 'bg-[#C1856A]' : 'bg-white border border-gray-300'
              }`}
            >
              <HStack className="items-center gap-2">
                <Pencil
                  size={20}
                  color={drawMode === 'draw' ? 'white' : '#30352D'}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm font-bold ${
                    drawMode === 'draw' ? 'text-white' : 'text-[#30352D]'
                  }`}
                >
                  Draw
                </Text>
              </HStack>
            </Pressable>
          </HStack>

          {/* Instructions */}
          <Text className="text-[#30352D] text-xs text-center mt-3">
            {drawMode === 'circle'
              ? 'Drag the map to set your work area center, then adjust the radius'
              : isDrawing
              ? 'Tap on the map to draw your work area boundary'
              : 'Tap "Start Drawing" to create a custom work area'}
          </Text>
        </Box>

        {/* Map Container */}
        <View style={{ flex: 1, position: 'relative' }}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
            onPress={handleMapPress}
            scrollEnabled={drawMode === 'circle' || !isDrawing}
            zoomEnabled={!isDrawing}
            rotateEnabled={!isDrawing}
            pitchEnabled={!isDrawing}
            showsUserLocation
            showsMyLocationButton={!isDrawing}
            moveOnMarkerPress={false}
          >
            {/* Circle Mode */}
            {drawMode === 'circle' && centerCoordinate && (
              <Circle
                center={centerCoordinate}
                radius={milesToMeters(radiusMiles)}
                strokeColor="rgba(193, 133, 106, 0.5)"
                fillColor="rgba(193, 133, 106, 0.2)"
                strokeWidth={2}
              />
            )}

            {/* Draw Mode - Completed Polygon */}
            {drawMode === 'draw' && drawnCoordinates.length > 0 && (
              <Polygon
                coordinates={drawnCoordinates}
                strokeColor="rgba(193, 133, 106, 0.8)"
                fillColor="rgba(193, 133, 106, 0.2)"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
              />
            )}

            {/* Draw Mode - Current Drawing Path */}
            {drawMode === 'draw' && currentDrawingPath.length > 0 && (
              <Polygon
                coordinates={currentDrawingPath}
                strokeColor="rgba(193, 133, 106, 0.8)"
                fillColor="rgba(193, 133, 106, 0.1)"
                strokeWidth={3}
                lineDashPattern={[5, 5]}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </MapView>

          {/* Center Pin Indicator - Only for Circle Mode */}
          {drawMode === 'circle' && (
            <Box
              className="absolute items-center justify-center"
              style={{
                left: width / 2 - 15,
                top: height / 2 - 45,
                pointerEvents: 'none',
              }}
            >
              <MapPin size={30} color="#C1856A" fill="#C1856A" />
            </Box>
          )}

          {/* Drawing Mode Indicator */}
          {drawMode === 'draw' && isDrawing && (
            <Box
              className="absolute top-4 left-0 right-0 items-center"
              style={{ pointerEvents: 'none' }}
            >
              <Box className="bg-[#C1856A] px-4 py-2 rounded-full">
                <Text className="text-white text-sm font-bold">
                  Tap on map to draw • {currentDrawingPath.length} points
                </Text>
              </Box>
            </Box>
          )}
        </View>

        {/* Control Panel */}
        <Box className="bg-white px-6 py-6 border-t border-gray-200">
          {drawMode === 'circle' ? (
            /* Circle Mode Controls */
            <VStack className="gap-4">
              <HStack className="items-center justify-between">
                <Text className="text-[#30352D] text-base font-bold">Work Area Radius</Text>
                <Text className="text-[#C1856A] text-xl font-bold">
                  {radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'}
                </Text>
              </HStack>

              <HStack className="items-center gap-4">
                <Pressable
                  onPress={decreaseRadius}
                  className="w-12 h-12 bg-[#F5F5F5] rounded-full items-center justify-center"
                  disabled={radiusMiles <= MIN_RADIUS_MILES}
                >
                  <Minus
                    size={24}
                    color={radiusMiles <= MIN_RADIUS_MILES ? '#CCC' : '#30352D'}
                  />
                </Pressable>

                <Box className="flex-1">
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={MIN_RADIUS_MILES}
                    maximumValue={MAX_RADIUS_MILES}
                    step={1}
                    value={radiusMiles}
                    onValueChange={setRadiusMiles}
                    minimumTrackTintColor="#C1856A"
                    maximumTrackTintColor="#E5E5E5"
                    thumbTintColor="#C1856A"
                  />
                </Box>

                <Pressable
                  onPress={increaseRadius}
                  className="w-12 h-12 bg-[#F5F5F5] rounded-full items-center justify-center"
                  disabled={radiusMiles >= MAX_RADIUS_MILES}
                >
                  <Plus
                    size={24}
                    color={radiusMiles >= MAX_RADIUS_MILES ? '#CCC' : '#30352D'}
                  />
                </Pressable>
              </HStack>

              <Text className="text-[#333A31] text-xs text-center">
                {"You'll receive job requests within this radius from your work area center"}
              </Text>
            </VStack>
          ) : (
            /* Draw Mode Controls */
            <VStack className="gap-3">
              {!isDrawing && drawnCoordinates.length === 0 && (
                <Pressable
                  onPress={startDrawing}
                  className="bg-[#C1856A] rounded-xl py-4 items-center"
                >
                  <HStack className="items-center gap-2">
                    <Pencil size={20} color="white" strokeWidth={2} />
                    <Text className="text-white text-base font-bold">Start Drawing</Text>
                  </HStack>
                </Pressable>
              )}

              {isDrawing && (
                <HStack className="gap-3">
                  <Pressable
                    onPress={finishDrawing}
                    className="flex-1 bg-[#4A5347] rounded-xl py-4 items-center"
                    disabled={currentDrawingPath.length < 3}
                  >
                    <Text
                      className={`text-base font-bold ${
                        currentDrawingPath.length < 3 ? 'text-gray-400' : 'text-white'
                      }`}
                    >
                      Finish ({currentDrawingPath.length})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={clearDrawing}
                    className="w-14 bg-gray-200 rounded-xl items-center justify-center"
                  >
                    <Trash2 size={20} color="#30352D" strokeWidth={2} />
                  </Pressable>
                </HStack>
              )}

              {!isDrawing && drawnCoordinates.length > 0 && (
                <HStack className="gap-3">
                  <Pressable
                    onPress={startDrawing}
                    className="flex-1 bg-[#C1856A] rounded-xl py-4 items-center"
                  >
                    <Text className="text-white text-base font-bold">Redraw</Text>
                  </Pressable>

                  <Pressable
                    onPress={clearDrawing}
                    className="w-14 bg-gray-200 rounded-xl items-center justify-center"
                  >
                    <Trash2 size={20} color="#30352D" strokeWidth={2} />
                  </Pressable>
                </HStack>
              )}

              <Text className="text-[#333A31] text-xs text-center">
                {isDrawing
                  ? 'Tap at least 3 points to create your work area boundary'
                  : "You'll receive job requests within your custom work area"}
              </Text>
            </VStack>
          )}

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className={`rounded-xl py-4 items-center mt-4 ${
              hasValidArea ? 'bg-[#C1856A]' : 'bg-gray-300'
            }`}
            disabled={!hasValidArea}
          >
            <Text
              className={`text-base font-bold ${hasValidArea ? 'text-white' : 'text-gray-500'}`}
            >
              Save Work Area
            </Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
