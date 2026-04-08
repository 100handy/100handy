import React from 'react';
import { View, Pressable, TextInput, type ViewProps, type PressableProps, type TextInputProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const inputVariants = cva(
  'border-background-300 flex-row overflow-hidden content-center data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:hover:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-background-300 items-center',
  {
    variants: {
      size: {
        xl: 'h-12',
        lg: 'h-11',
        md: 'h-10',
        sm: 'h-9',
      },
      variant: {
        underlined:
          'rounded-none border-b data-[invalid=true]:border-b-2 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700',
        outline:
          'rounded border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',
        rounded:
          'rounded-full border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
);

const inputIconVariants = cva(
  'justify-center items-center text-typography-400 fill-none',
  {
    variants: {
      size: {
        '2xs': 'h-3 w-3',
        'xs': 'h-3.5 w-3.5',
        'sm': 'h-4 w-4',
        'md': 'h-[18px] w-[18px]',
        'lg': 'h-5 w-5',
        'xl': 'h-6 w-6',
      },
    },
  }
);

const inputSlotVariants = cva(
  'justify-center items-center web:disabled:cursor-not-allowed'
);

const inputFieldVariants = cva(
  'flex-1 text-typography-900 py-0 px-3 placeholder:text-typography-500 h-full web:cursor-text web:data-[disabled=true]:cursor-not-allowed',
  {
    variants: {
      variant: {
        underlined: 'web:outline-0 web:outline-none px-0',
        outline: 'web:outline-0 web:outline-none',
        rounded: 'web:outline-0 web:outline-none px-4',
      },
      size: {
        '2xs': 'text-2xs',
        'xs': 'text-xs',
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      },
    },
  }
);

type InputContextValue = {
  variant?: 'underlined' | 'outline' | 'rounded';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  isDisabled?: boolean;
  isInvalid?: boolean;
};

const InputContext = React.createContext<InputContextValue>({});

export type InputProps = ViewProps &
  VariantProps<typeof inputVariants> & {
    className?: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
  };

const Input = React.forwardRef<React.ElementRef<typeof View>, InputProps>(
  ({ className, variant = 'outline', size = 'md', isDisabled = false, isInvalid = false, children, ...props }, ref) => {
    return (
      <InputContext.Provider value={{ variant: variant ?? undefined, size: size ?? undefined, isDisabled, isInvalid }}>
        <View
          ref={ref}
          className={cn(inputVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </View>
      </InputContext.Provider>
    );
  }
);

export type InputIconProps = ViewProps &
  VariantProps<typeof inputIconVariants> & {
    className?: string;
    as?: React.ElementType;
  };

const InputIcon = React.forwardRef<React.ElementRef<typeof View>, InputIconProps>(
  ({ className, size, as: Component = View, ...props }, ref) => {
    const context = React.useContext(InputContext);

    return (
      <Component
        ref={ref}
        className={cn(
          inputIconVariants({
            size: size || context.size || undefined,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

export type InputSlotProps = PressableProps & {
  className?: string;
};

const InputSlot = React.forwardRef<React.ElementRef<typeof Pressable>, InputSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(inputSlotVariants(), className)}
        {...props}
      />
    );
  }
);

export type InputFieldProps = TextInputProps &
  VariantProps<typeof inputFieldVariants> & {
    className?: string;
  };

const InputField = React.forwardRef<React.ElementRef<typeof TextInput>, InputFieldProps>(
  ({ className, variant, size, ...props }, ref) => {
    const context = React.useContext(InputContext);

    return (
      <TextInput
        ref={ref}
        editable={!context.isDisabled}
        className={cn(
          inputFieldVariants({
            variant: variant || context.variant || undefined,
            size: size || context.size || undefined,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
InputIcon.displayName = 'InputIcon';
InputSlot.displayName = 'InputSlot';
InputField.displayName = 'InputField';

export { Input, InputField, InputIcon, InputSlot };
