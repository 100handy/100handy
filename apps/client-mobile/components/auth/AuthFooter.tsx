import React from 'react';
import { View, Text, Linking } from 'react-native';

export default function AuthFooter() {
  return (
    <View>
      <Text className="text-center text-[12px] font-worksans-medium leading-[18px]" style={{ color: '#30352D' }}>
        I agree to the{' '}
        <Text
          style={{ color: '#C1856A' }}
          onPress={() => Linking.openURL('https://100handy-client-web.vercel.app/terms')}
        >
          Terms of Service
        </Text>
        {' '}and have reviewed the{' '}
        <Text
          style={{ color: '#C1856A' }}
          onPress={() => Linking.openURL('https://100handy-client-web.vercel.app/terms')}
        >
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
}
