import React, { useEffect, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { getPublicSiteSetting, resolvePublicAssetUrl } from '@/lib/public-settings';

// PNG source dimensions: 2084 x 834
const LOGO_ASPECT_RATIO = 2084 / 834;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = SCREEN_WIDTH * 0.75;
const LOGO_HEIGHT = LOGO_WIDTH / LOGO_ASPECT_RATIO;

export default function WelcomeLogo() {
  const [remoteUri, setRemoteUri] = useState<string | null>(null)

  useEffect(() => {
    getPublicSiteSetting('app.images.welcome').then((value) => {
      const uri = resolvePublicAssetUrl(value?.logo)
      if (uri) {
        setRemoteUri(uri)
      }
    })
  }, [])

  return (
    <View
      className="w-full items-center"
      style={{ height: LOGO_HEIGHT + 16, justifyContent: 'center' }}
    >
      <Image
        source={remoteUri ? { uri: remoteUri } : require('@/assets/images/100handy-green.png')}
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        resizeMode="contain"
      />
    </View>
  );
}
