import React from 'react';
import { View, Text } from 'react-native';

export default function AuthFooter() {
  return (
    <View>
      <Text className="text-center text-[12px] font-worksans-medium leading-[18px]" style={{ color: '#30352D' }}>
        By signing up, you agree to the{' '}
        <Text style={{ color: '#C1856A' }}>Term of service</Text>
        {'\n'}
        and have reviewed the{' '}
        <Text style={{ color: '#C1856A' }}>Privacy Policy.</Text>
        {'\n'}
        Manage <Text style={{ color: '#C1856A' }}>privacy settings</Text>
      </Text>
    </View>
  );
}
