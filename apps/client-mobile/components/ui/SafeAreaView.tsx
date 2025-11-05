import React from 'react';
import { SafeAreaView as RNCSafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

/**
 * SafeAreaView wrapper component using react-native-safe-area-context
 * Drop-in replacement for the deprecated React Native SafeAreaView
 */
export const SafeAreaView: React.FC<SafeAreaViewProps> = (props) => {
  return <RNCSafeAreaView {...props} />;
};

export default SafeAreaView;
