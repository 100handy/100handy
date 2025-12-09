import React from 'react';
import { View, Text } from 'react-native';

interface PricingBreakdownProps {
  hourlyRateCents: number;
  estimatedHours: number;
}

export function PricingBreakdown({ hourlyRateCents, estimatedHours }: PricingBreakdownProps) {
  const hourlyRate = (hourlyRateCents / 100).toFixed(2);
  const estimatedTotal = ((hourlyRateCents * estimatedHours) / 100).toFixed(2);

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4">
      <Text className="text-xs font-worksans-medium text-gray-500 mb-3">PRICING</Text>

      <View className="gap-2">
        {/* Hourly Rate */}
        <View className="flex-row justify-between">
          <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
            Hourly Rate:
          </Text>
          <Text className="text-sm font-worksans-medium" style={{ color: '#30352D' }}>
            £{hourlyRate}/hr
          </Text>
        </View>

        {/* Estimated Hours */}
        <View className="flex-row justify-between">
          <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
            Estimated Hours:
          </Text>
          <Text className="text-sm font-worksans-medium" style={{ color: '#30352D' }}>
            {estimatedHours}h
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 my-1" />

        {/* Estimated Total */}
        <View className="flex-row justify-between">
          <Text className="text-sm font-worksans-semibold" style={{ color: '#30352D' }}>
            Estimated Total:
          </Text>
          <Text className="text-sm font-worksans-semibold" style={{ color: '#30352D' }}>
            £{estimatedTotal}
          </Text>
        </View>
      </View>

      {/* Disclaimer */}
      <Text className="text-xs font-worksans mt-3" style={{ color: '#6B7280' }}>
        * You will only be charged when the task is marked as complete. Final amount may vary based
        on actual time worked.
      </Text>
    </View>
  );
}
