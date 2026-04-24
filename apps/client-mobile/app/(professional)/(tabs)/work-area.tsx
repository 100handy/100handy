import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polygon, Marker, LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Hand, Minus, Pencil, Plus, X } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import {
  useWorkArea,
  useSaveWorkArea,
  type Coordinate,
} from "@shared/supabase";
import { useToast } from "@/components/ui/toast";

const { width, height } = Dimensions.get("window");
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

export default function WorkAreaTab() {
  const toast = useToast();
  const [region, setRegion] = useState<Region>(LONDON_REGION);

  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<LatLng[]>([]);

  const mapRef = useRef<MapView>(null);

  // Query hooks for persistence
  const { data: existingWorkArea, isLoading: isLoadingWorkArea } =
    useWorkArea();
  const { mutate: saveWorkAreaMutation, isPending: isSaving } =
    useSaveWorkArea();

  // PanResponder for handling touch gestures on the map
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDrawnCoordinates([]);
        setIsReviewing(false);
      },
      onPanResponderMove: async (event) => {
        const { locationX, locationY } = event.nativeEvent;
        if (mapRef.current) {
          try {
            const coordinate = await mapRef.current.coordinateForPoint({
              x: locationX,
              y: locationY,
            });

            if (coordinate) {
              setDrawnCoordinates((prev) => [...prev, coordinate]);
            }
          } catch (error) {
            console.error("Error converting point:", error);
          }
        }
      },
      onPanResponderRelease: () => {
        setDrawnCoordinates((prev) => {
          if (prev.length > 2) {
            setIsReviewing(true);
            // Only add closing point if it's different from the last point
            const lastPoint = prev[prev.length - 1];
            const firstPoint = prev[0];
            const isAlreadyClosed =
              lastPoint.latitude === firstPoint.latitude &&
              lastPoint.longitude === firstPoint.longitude;
            if (isAlreadyClosed) {
              return prev;
            }
            return [...prev, firstPoint];
          }
          return [];
        });
      },
    }),
  ).current;

  // Load existing work area coordinates
  useEffect(() => {
    if (
      existingWorkArea?.coordinates &&
      existingWorkArea.coordinates.length > 0
    ) {
      const coords: LatLng[] = existingWorkArea.coordinates.map(
        (c: Coordinate) => ({
          latitude: c.latitude,
          longitude: c.longitude,
        }),
      );
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

  useEffect(() => {
    if (existingWorkArea?.coordinates?.length) {
      return;
    }

    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      if (!isMounted) {
        return;
      }

      const nextRegion: Region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 200);
    })().catch((error) => {
      console.warn("Unable to center map on current location:", error);
    });

    return () => {
      isMounted = false;
    };
  }, [existingWorkArea]);

  const handleSave = () => {
    if (drawnCoordinates.length > 2) {
      const coordinates: Coordinate[] = drawnCoordinates.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));

      saveWorkAreaMutation(
        { coordinates },
        {
          onSuccess: () => {
            toast.success("Saved", "Work area updated");
          },
          onError: (error) => {
            console.error("Failed to save work area:", error);
            toast.error(
              "Save failed",
              error instanceof Error ? error.message : "Please try again",
            );
          },
        },
      );
    }
  };

  const handleClear = () => {
    setDrawnCoordinates([]);
    setIsDrawingMode(false);
    setIsReviewing(false);
    setIsEditing(false);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(true);
    setIsEditing(false);
    setDrawnCoordinates([]);
    setIsReviewing(false);
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setIsDrawingMode(false);
  };

  const handleZoom = (direction: "in" | "out") => {
    const scale = direction === "in" ? 0.5 : 2;
    const nextRegion: Region = {
      ...region,
      latitudeDelta: Math.max(0.002, Math.min(1, region.latitudeDelta * scale)),
      longitudeDelta: Math.max(0.002, Math.min(1, region.longitudeDelta * scale)),
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 200);
  };

  const handleVertexDrag = (index: number, coordinate: LatLng) => {
    setDrawnCoordinates((prev) => {
      const updated = [...prev];
      updated[index] = coordinate;
      // If dragging the first vertex, also update the closing point
      if (index === 0 && updated.length > 1 && updated[updated.length - 1]) {
        updated[updated.length - 1] = coordinate;
      }
      // If dragging the last point (closing point), also update the first
      if (index === updated.length - 1 && updated.length > 1) {
        updated[0] = coordinate;
      }
      return updated;
    });
  };

  if (isLoadingWorkArea) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4A5347" />
          <Text className="text-brand-dark-alt text-lg mt-4 font-worksans">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView
        edges={["top"]}
        className={`z-10 ${isReviewing ? "bg-green-50" : "bg-white"}`}
      >
        <View className="px-6 py-4 flex-row items-center justify-center">
          <Text className="text-brand-dark-alt text-lg font-worksans-bold">
            {isReviewing ? "Reviewing work area" : "Set Work Area"}
          </Text>
        </View>
      </SafeAreaView>

      {/* Map */}
      <View style={StyleSheet.absoluteFillObject} className="top-[100px]">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          scrollEnabled={!isDrawingMode && !isEditing}
          zoomEnabled={!isDrawingMode}
          rotateEnabled={!isDrawingMode && !isEditing}
          pitchEnabled={!isDrawingMode && !isEditing}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {drawnCoordinates.length > 0 && (
            <Polygon
              coordinates={drawnCoordinates}
              strokeColor="#1E88E5"
              fillColor={
                isReviewing
                  ? "rgba(30, 136, 229, 0.2)"
                  : "rgba(30, 136, 229, 0.1)"
              }
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          )}
          {/* Draggable vertex markers in edit mode */}
          {isEditing &&
            drawnCoordinates.map((coord, index) => {
              // Skip the closing point (duplicate of first)
              if (index === drawnCoordinates.length - 1 && drawnCoordinates.length > 2) return null;
              return (
                <Marker
                  key={`vertex-${index}`}
                  coordinate={coord}
                  draggable
                  onDragEnd={(e) => handleVertexDrag(index, e.nativeEvent.coordinate)}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: index === 0 ? '#1E88E5' : '#fff',
                      borderWidth: 3,
                      borderColor: '#1E88E5',
                    }}
                  />
                </Marker>
              );
            })}
        </MapView>

        {/* Drawing Overlay */}
        {isDrawingMode && !isReviewing && (
          <View
            style={StyleSheet.absoluteFillObject}
            {...panResponder.panHandlers}
          />
        )}
      </View>

      <View className="absolute right-5 top-[120px] rounded-full bg-white shadow-lg overflow-hidden">
        <Pressable
          accessibilityLabel="Zoom in"
          onPress={() => handleZoom("in")}
          className="w-12 h-12 items-center justify-center border-b border-gray-100"
        >
          <Plus size={22} color="#30352D" />
        </Pressable>
        <Pressable
          accessibilityLabel="Zoom out"
          onPress={() => handleZoom("out")}
          className="w-12 h-12 items-center justify-center"
        >
          <Minus size={22} color="#30352D" />
        </Pressable>
      </View>

      {/* Controls - positioned above tab bar */}
      <View className="absolute bottom-[90px] left-0 right-0 p-6 pointer-events-box-none">
        {/* Floating Action Buttons */}
        {!isReviewing && (
          <View className="flex-row justify-end mb-4">
            {isDrawingMode ? (
              <View className="bg-white rounded-full shadow-lg px-6 py-3 flex-row items-center gap-2">
                <Text className="text-brand-dark-alt font-worksans-medium">
                  Draw on map
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={toggleDrawingMode}
                className="bg-white rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2"
              >
                <Hand size={20} color="#4A5347" />
                <Text className="text-[#4A5347] font-worksans-bold text-base">
                  Draw area
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Edit/Clear Buttons (when area is drawn) */}
        {isReviewing && (
          <View className="flex-row justify-end gap-3 mb-4">
            <Pressable
              onPress={toggleEditMode}
              className={`rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2 ${isEditing ? "bg-blue-100" : "bg-white"}`}
            >
              <Pencil size={20} color={isEditing ? "#1E88E5" : "#4A5347"} />
              <Text className={`font-worksans-bold text-base ${isEditing ? "text-blue-600" : "text-[#4A5347]"}`}>
                {isEditing ? "Done editing" : "Edit vertices"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleClear}
              className="bg-white rounded-xl shadow-lg px-4 py-3 flex-row items-center gap-2"
            >
              <X size={20} color="#4A5347" />
              <Text className="text-[#4A5347] font-worksans-bold text-base">
                Clear
              </Text>
            </Pressable>
          </View>
        )}

        {/* Save Button */}
        <Button
          className={`rounded-full shadow-sm h-[56px] ${isReviewing && !isSaving ? "bg-[#4A5347]" : "bg-gray-300"}`}
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
