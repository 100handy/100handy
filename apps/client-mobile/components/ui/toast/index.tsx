import { toast, Toaster } from 'sonner-native';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: 'error' | 'success' | 'info' | 'warning';
  duration?: number;
}

/**
 * Toast hook with same API as previous implementation
 * Compatible with existing codebase usage
 */
export const useToast = () => {
  const show = ({
    title,
    description,
    action = 'info',
    duration = 2500,
  }: Omit<ToastProps, 'id'>) => {
    const options = { description, duration };

    switch (action) {
      case 'success':
        toast.success(title || '', options);
        break;
      case 'error':
        toast.error(title || '', options);
        break;
      case 'warning':
        toast.warning(title || '', options);
        break;
      default:
        toast(title || '', options);
    }
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
    hide: () => toast.dismiss(),
  };
};

/**
 * ToastProvider component - renders the Toaster at the root
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-center" offset={60} />
    </>
  );
};

export { toast, Toaster };
