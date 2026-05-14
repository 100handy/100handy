import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';

interface PullDownDismissProps {
  children: React.ReactNode;
  onDismiss: () => void;
}

export function PullDownDismiss({ children, onDismiss }: PullDownDismissProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  const resetPosition = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 110,
      friction: 12,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          translateY.setValue(Math.max(0, Math.min(gestureState.dy, 180)));
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldDismiss = gestureState.dy > 110 || gestureState.vy > 1.2;

          if (shouldDismiss) {
            Animated.timing(translateY, {
              toValue: 220,
              duration: 160,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                onDismiss();
                translateY.setValue(0);
              }
            });
            return;
          }

          resetPosition();
        },
        onPanResponderTerminate: resetPosition,
      }),
    [onDismiss, translateY]
  );

  return (
    <Animated.View className="flex-1" style={{ transform: [{ translateY }] }}>
      <View className="items-center pb-2 pt-3" {...panResponder.panHandlers}>
        <View className="h-1.5 w-12 rounded-full bg-gray-300" />
        <Text className="mt-2 text-[11px] font-medium uppercase tracking-[1px] text-gray-400">
          Pull down to close
        </Text>
      </View>
      <View className="flex-1">{children}</View>
    </Animated.View>
  );
}
