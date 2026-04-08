import React from 'react';
import { View } from 'react-native';
import Logo100Top from '@/assets/images/logo-100-top.svg';

const LOGO_ASPECT_RATIO = 771 / 372;

const LOGO_DIMENSIONS = {
  auth: 150,
  hero: 200,
} as const;

type AuthLogoProps = {
  size?: keyof typeof LOGO_DIMENSIONS;
  className?: string;
  color?: string;
};

export default function AuthLogo({
  size = 'auth',
  className = 'items-center',
  color,
}: AuthLogoProps) {
  const width = LOGO_DIMENSIONS[size];
  const height = width / LOGO_ASPECT_RATIO;

  return (
    <View className={className}>
      <Logo100Top width={width} height={height} color={color ?? '#30352D'} />
    </View>
  );
}
