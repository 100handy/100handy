import React from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';

// Two logo variants matching the web:
//   'green' — dark olive green text, used on light/white backgrounds
//   'cream' — pale cream text, used on dark/green backgrounds
type LogoVariant = 'green' | 'cream';

const LOGOS: Record<LogoVariant, ImageSourcePropType> = {
  green: require('@/assets/images/100handy-green.png') as ImageSourcePropType,
  cream: require('@/assets/images/100handy-cream.png') as ImageSourcePropType,
};

// PNG source dimensions: 2084 x 834
const LOGO_ASPECT_RATIO = 2084 / 834;

const LOGO_WIDTHS = {
  compact: 130,
  auth: 180,
  hero: 240,
} as const;

type AuthLogoProps = {
  size?: keyof typeof LOGO_WIDTHS;
  variant?: LogoVariant;
  className?: string;
};

export default function AuthLogo({
  size = 'auth',
  variant = 'green',
  className = 'items-center',
}: AuthLogoProps) {
  const width = LOGO_WIDTHS[size];
  const height = width / LOGO_ASPECT_RATIO;

  return (
    <View className={className}>
      <Image
        source={LOGOS[variant]}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
}
