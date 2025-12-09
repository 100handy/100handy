import React from 'react';
import { View, Text } from 'react-native';
import type { BookingStatus } from '@shared/supabase/bookings';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: '#FEF3C7', // yellow-100
          textColor: '#92400E', // yellow-800
          borderColor: '#FDE68A', // yellow-200
        };
      case 'accepted':
        return {
          backgroundColor: '#DBEAFE', // blue-100
          textColor: '#1E40AF', // blue-800
          borderColor: '#BFDBFE', // blue-200
        };
      case 'in_progress':
        return {
          backgroundColor: '#E9D5FF', // purple-100
          textColor: '#6B21A8', // purple-800
          borderColor: '#DDD6FE', // purple-200
        };
      case 'completed':
        return {
          backgroundColor: '#D1FAE5', // green-100
          textColor: '#065F46', // green-800
          borderColor: '#A7F3D0', // green-200
        };
      case 'cancelled':
        return {
          backgroundColor: '#FEE2E2', // red-100
          textColor: '#991B1B', // red-800
          borderColor: '#FECACA', // red-200
        };
      default:
        return {
          backgroundColor: '#F3F4F6', // gray-100
          textColor: '#1F2937', // gray-800
          borderColor: '#E5E7EB', // gray-200
        };
    }
  };

  const styles = getStatusStyles(status);
  const displayText = status.replace('_', ' ').toUpperCase();

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999, // full rounded
      }}
    >
      <Text
        className="font-worksans-medium"
        style={{
          color: styles.textColor,
          fontSize: 12,
        }}
      >
        {displayText}
      </Text>
    </View>
  );
}
