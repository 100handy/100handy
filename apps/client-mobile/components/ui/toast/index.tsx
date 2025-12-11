import React from 'react';
import Toast, { BaseToast, ErrorToast, InfoToast, BaseToastProps, type ToastConfig } from 'react-native-toast-message';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: 'error' | 'success' | 'info' | 'warning';
  duration?: number;
}

/**
 * Toast configuration with custom styling using mobile design system
 */
export const toastConfig: ToastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#A3B899', // sage-green
        backgroundColor: '#FFFFFF',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333A31', // text-primary
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563', // text-secondary
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#DC2626', // status-danger
        backgroundColor: '#FFFFFF',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333A31', // text-primary
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563', // text-secondary
      }}
    />
  ),
  info: (props: BaseToastProps) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: '#3B82F6', // status-info
        backgroundColor: '#FFFFFF',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333A31', // text-primary
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563', // text-secondary
      }}
    />
  ),
  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#A16207', // status-warning
        backgroundColor: '#FFFFFF',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333A31', // text-primary
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563', // text-secondary
      }}
    />
  ),
};

/**
 * Toast hook with same API as Gluestack useToast
 * Compatible with existing codebase usage
 */
export const useToast = () => {
  const show = ({
    title,
    description,
    action = 'info',
    duration = 2500,
  }: Omit<ToastProps, 'id'>) => {
    Toast.show({
      type: action,
      text1: title,
      text2: description,
      visibilityTime: duration,
      autoHide: true,
      position: 'top',
      topOffset: 60,
    });

    // Safety hide in case autoHide misbehaves on some devices
    setTimeout(() => Toast.hide(), duration + 200);
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
    hide: () => Toast.hide(),
  };
};

/**
 * Toast component - must be placed at the root of the app
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} autoHide={true} />
    </>
  );
};

export default Toast;
