import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';

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
          <Box className="flex-1 justify-center items-center p-6">
            {children}
          </Box>
        </ScrollView>
      ) : (
        <Box className="flex-1 justify-center items-center p-6">
          {children}
        </Box>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;