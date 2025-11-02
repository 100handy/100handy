import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/ui/text';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

interface TimePickerWheelProps {
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function TimePickerWheel({
  values,
  selectedValue,
  onValueChange,
}: TimePickerWheelProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(values.indexOf(selectedValue));

  useEffect(() => {
    const index = values.indexOf(selectedValue);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (scrollViewRef.current && currentIndex >= 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: currentIndex * ITEM_HEIGHT,
          animated: true,
        });
      }, 100);
    }
  }, []);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (index >= 0 && index < values.length) {
      setCurrentIndex(index);
      if (values[index] !== selectedValue) {
        onValueChange(values[index]);
      }
    }
  };

  return (
    <View
      style={{
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        overflow: 'hidden',
        width: 60,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {values.map((value, index) => {
          const distance = Math.abs(index - currentIndex);
          const opacity = Math.max(0.3, 1 - distance * 0.3);
          const scale = Math.max(0.7, 1 - distance * 0.15);

          return (
            <View
              key={`${value}-${index}`}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  opacity,
                  transform: [{ scale }],
                }}
                className={`font-worksans-semibold ${
                  index === currentIndex ? 'text-[#30352D]' : 'text-[#BDBDBD]'
                }`}
              >
                {value}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Selection indicator */}
      <View
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#E5E5E5',
          pointerEvents: 'none',
        }}
      />
    </View>
  );
}
