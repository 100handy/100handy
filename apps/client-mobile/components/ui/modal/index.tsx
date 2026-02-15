import React from 'react';
import { Modal as RNModal, View, Pressable, ScrollView, type ViewProps, type PressableProps, type ScrollViewProps, type ModalProps as RNModalProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const modalVariants = cva(
  'w-full h-full justify-center items-center web:pointer-events-none',
  {
    variants: {
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        full: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const modalBackdropVariants = cva(
  'absolute left-0 top-0 right-0 bottom-0 bg-background-dark web:cursor-default opacity-50'
);

const modalContentVariants = cva(
  'bg-background-0 rounded-md overflow-hidden border border-outline-100 shadow-hard-2 p-6',
  {
    variants: {
      size: {
        xs: 'w-[60%] max-w-[360px]',
        sm: 'w-[70%] max-w-[420px]',
        md: 'w-[80%] max-w-[510px]',
        lg: 'w-[90%] max-w-[640px]',
        full: 'w-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const modalBodyVariants = cva('mt-2 mb-6');
const modalCloseButtonVariants = cva('z-10 rounded data-[focus-visible=true]:web:bg-background-100 web:outline-0 cursor-pointer');
const modalHeaderVariants = cva('justify-between items-center flex-row');
const modalFooterVariants = cva('flex-row justify-end items-center gap-2');

type ModalContextValue = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  onClose?: () => void;
};

const ModalContext = React.createContext<ModalContextValue>({});

export type ModalProps = Omit<RNModalProps, 'visible'> &
  VariantProps<typeof modalVariants> & {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
  };

const Modal = React.forwardRef<React.ElementRef<typeof View>, ModalProps>(
  ({ className, size = 'md', isOpen = false, onClose, children, ...props }, ref) => {
    return (
      <ModalContext.Provider value={{ size: size ?? undefined, onClose }}>
        <RNModal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={onClose}
          {...props}
        >
          <View
            ref={ref}
            className={cn(modalVariants({ size }), className)}
          >
            {children}
          </View>
        </RNModal>
      </ModalContext.Provider>
    );
  }
);

export type ModalBackdropProps = PressableProps & {
  className?: string;
};

const ModalBackdrop = React.forwardRef<React.ElementRef<typeof Pressable>, ModalBackdropProps>(
  ({ className, ...props }, ref) => {
    const { onClose } = React.useContext(ModalContext);

    return (
      <Pressable
        ref={ref}
        onPress={onClose}
        className={cn(modalBackdropVariants(), className)}
        {...props}
      />
    );
  }
);

export type ModalContentProps = ViewProps &
  VariantProps<typeof modalContentVariants> & {
    className?: string;
  };

const ModalContent = React.forwardRef<React.ElementRef<typeof View>, ModalContentProps>(
  ({ className, size, ...props }, ref) => {
    const context = React.useContext(ModalContext);

    return (
      <View
        ref={ref}
        className={cn(
          modalContentVariants({
            size: size || context.size || undefined,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

export type ModalHeaderProps = ViewProps & {
  className?: string;
};

const ModalHeader = React.forwardRef<React.ElementRef<typeof View>, ModalHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(modalHeaderVariants(), className)}
        {...props}
      />
    );
  }
);

export type ModalBodyProps = ScrollViewProps & {
  className?: string;
};

const ModalBody = React.forwardRef<React.ElementRef<typeof ScrollView>, ModalBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <ScrollView
        ref={ref}
        className={cn(modalBodyVariants(), className)}
        {...props}
      />
    );
  }
);

export type ModalFooterProps = ViewProps & {
  className?: string;
};

const ModalFooter = React.forwardRef<React.ElementRef<typeof View>, ModalFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(modalFooterVariants(), className)}
        {...props}
      />
    );
  }
);

export type ModalCloseButtonProps = PressableProps & {
  className?: string;
};

const ModalCloseButton = React.forwardRef<React.ElementRef<typeof Pressable>, ModalCloseButtonProps>(
  ({ className, ...props }, ref) => {
    const { onClose } = React.useContext(ModalContext);

    return (
      <Pressable
        ref={ref}
        onPress={onClose}
        className={cn(modalCloseButtonVariants(), className)}
        {...props}
      />
    );
  }
);

Modal.displayName = 'Modal';
ModalBackdrop.displayName = 'ModalBackdrop';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalCloseButton.displayName = 'ModalCloseButton';

export {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
};
