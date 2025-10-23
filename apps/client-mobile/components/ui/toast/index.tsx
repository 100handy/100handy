import React from 'react';
import { Alert } from 'react-native';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: 'error' | 'success' | 'info' | 'warning';
  duration?: number;
}

/**
 * Simple toast hook using React Native Alert for now
 * Can be replaced with proper toast UI component once dependencies are installed
 */
export const useToast = () => {
  const show = ({
    title,
    description,
    action = 'info',
  }: Omit<ToastProps, 'id' | 'duration'>) => {
    const displayTitle = title || (action === 'error' ? 'Error' : action === 'success' ? 'Success' : 'Info');
    Alert.alert(displayTitle, description);
  };

  return {
    show,
    success: (title: string, description?: string) =>
      show({ title, description, action: 'success' }),
    error: (title: string, description?: string) =>
      show({ title, description, action: 'error' }),
    info: (title: string, description?: string) =>
      show({ title, description, action: 'info' }),
    warning: (title: string, description?: string) =>
      show({ title, description, action: 'warning' }),
  };
};

