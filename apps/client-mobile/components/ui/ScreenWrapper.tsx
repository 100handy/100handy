import React from 'react';
import { StatusBar, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, scrollable = false }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {scrollable ? (
        <ScrollView className="flex-grow">
          <View className="flex-1 justify-center items-center p-6">
            {children}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;