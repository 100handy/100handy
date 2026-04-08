import React from 'react';
import { Dimensions, View } from 'react-native';
import Logo100Top from '@/assets/images/logo-100-top.svg';
import Logo100Bottom from '@/assets/images/logo-100-bottom.svg';

const LOGO_ASPECT_RATIO = 771 / 372;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = SCREEN_WIDTH * 1.75;
const LOGO_HEIGHT = LOGO_WIDTH / LOGO_ASPECT_RATIO;
const TOP_LOGO_X_OFFSET = -SCREEN_WIDTH * 0.06;
const BOTTOM_LOGO_X_OFFSET = -SCREEN_WIDTH * 0.72;
const BOTTOM_CLIP_RATIO = 0.35;
const BOTTOM_VISIBLE_HEIGHT = LOGO_HEIGHT * (1 - BOTTOM_CLIP_RATIO);
const GAP = LOGO_HEIGHT * 0.3;
const SECOND_SECTION_TOP = LOGO_HEIGHT + GAP;
const CONTAINER_HEIGHT = SECOND_SECTION_TOP + BOTTOM_VISIBLE_HEIGHT;

export default function WelcomeLogo() {
  return (
    <View
      className="w-full overflow-hidden"
      style={{ height: CONTAINER_HEIGHT }}
    >
      <View style={{ position: 'absolute', top: 0, left: TOP_LOGO_X_OFFSET }}>
        <Logo100Top width={LOGO_WIDTH} height={LOGO_HEIGHT} color="#30352D" />
      </View>

      {/* Clip container shows only bottom portion of second logo */}
      <View
        style={{
          position: 'absolute',
          top: SECOND_SECTION_TOP,
          left: 0,
          right: 0,
          height: BOTTOM_VISIBLE_HEIGHT,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -LOGO_HEIGHT * BOTTOM_CLIP_RATIO,
            left: BOTTOM_LOGO_X_OFFSET,
          }}
        >
          <Logo100Bottom width={LOGO_WIDTH} height={LOGO_HEIGHT} color="#30352D" />
        </View>
      </View>
    </View>
  );
}
