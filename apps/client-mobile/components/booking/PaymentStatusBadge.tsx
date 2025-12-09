import React from 'react';
import { View, Text } from 'react-native';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getStatusStyles = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: '#F3F4F6', // gray-100
          textColor: '#1F2937', // gray-800
          borderColor: '#E5E7EB', // gray-200
        };
      case 'authorized':
        return {
          backgroundColor: '#DBEAFE', // blue-100
          textColor: '#1E40AF', // blue-800
          borderColor: '#BFDBFE', // blue-200
        };
      case 'captured':
        return {
          backgroundColor: '#D1FAE5', // green-100
          textColor: '#065F46', // green-800
          borderColor: '#A7F3D0', // green-200
        };
      case 'failed':
        return {
          backgroundColor: '#FEE2E2', // red-100
          textColor: '#991B1B', // red-800
          borderColor: '#FECACA', // red-200
        };
      case 'refunded':
        return {
          backgroundColor: '#FFEDD5', // orange-100
          textColor: '#9A3412', // orange-800
          borderColor: '#FED7AA', // orange-200
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
  const displayText = status.toUpperCase();

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
