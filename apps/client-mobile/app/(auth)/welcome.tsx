import React from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';
import Logo100Top from '@/assets/images/logo-100-top.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function GeometricBackground() {
  // Full-screen geometric shapes matching Figma 484:431
  // Dark green base with cream/terracotta/sage angular shapes in upper portion
  const w = SCREEN_WIDTH;
  const h = SCREEN_HEIGHT;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Dark green base */}
        <Rect x="0" y="0" width={w} height={h} fill="#333A31" />

        {/* Large cream/beige diamond — rotated rectangle in upper area */}
        <Polygon
          points={`${w * 0.15},${h * -0.05} ${w * 0.85},${h * 0.08} ${w * 0.7},${h * 0.42} ${w * 0.0},${h * 0.29}`}
          fill="#F3E3D3"
        />

        {/* Terracotta accent — right side overlap */}
        <Polygon
          points={`${w * 0.65},${h * 0.02} ${w * 1.1},${h * 0.05} ${w * 1.0},${h * 0.35} ${w * 0.7},${h * 0.42}`}
          fill="#C1856A"
        />

        {/* Sage green accent — top-left */}
        <Polygon
          points={`${w * -0.1},${h * -0.02} ${w * 0.25},${h * -0.08} ${w * 0.15},${h * 0.22} ${w * -0.08},${h * 0.18}`}
          fill="#A0B194"
        />

        {/* Darker green overlap — creates depth between shapes */}
        <Polygon
          points={`${w * 0.0},${h * 0.29} ${w * 0.15},${h * 0.22} ${w * 0.25},${h * 0.38} ${w * 0.05},${h * 0.42}`}
          fill="#2D3229"
        />
      </Svg>
    </View>
  );
}

export default function WelcomeSplash() {
  const router = useRouter();

  const handleGetStarted = (): void => {
    router.push('/(auth)/(client)');
  };

  const logoWidth = SCREEN_WIDTH * 0.42;
  const logoHeight = logoWidth * (372 / 771);

  return (
    <View className="flex-1" style={{ backgroundColor: '#333A31' }}>
      <GeometricBackground />

      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Logo + Welcome centered in lower-middle area */}
          <View className="flex-1 items-center justify-end" style={{ paddingBottom: SCREEN_HEIGHT * 0.22 }}>
            <View className="items-center">
              <Logo100Top width={logoWidth} height={logoHeight} color="#FFFFFF" />
              <Text
                className="font-worksans-light text-[32px] mt-3"
                style={{ color: '#FFFFFF' }}
              >
                Welcome
              </Text>
            </View>
          </View>

          {/* Get Started Link */}
          <View className="px-6 pb-8">
            <Pressable onPress={handleGetStarted}>
              <View className="flex-row items-center justify-end gap-1">
                <Text
                  className="text-[18px] font-worksans-medium"
                  style={{ color: '#A0B194' }}
                >
                  Get started
                </Text>
                <ChevronRight size={18} color="#A0B194" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
