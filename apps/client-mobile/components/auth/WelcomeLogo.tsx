import React from 'react';
import { Dimensions, Image, View } from 'react-native';

// PNG source dimensions: 2084 x 834
const LOGO_ASPECT_RATIO = 2084 / 834;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = SCREEN_WIDTH * 0.75;
const LOGO_HEIGHT = LOGO_WIDTH / LOGO_ASPECT_RATIO;

export default function WelcomeLogo() {
  return (
    <View
      className="w-full items-center"
      style={{ height: LOGO_HEIGHT + 16, justifyContent: 'center' }}
    >
      <Image
        source={require('@/assets/images/100handy-green.png')}
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        resizeMode="contain"
      />
    </View>
  );
}
