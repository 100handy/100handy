import React from 'react';
import { View, Pressable, Text, type ViewProps, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// Simplified Select component - can be enhanced later with proper dropdown/picker
// For now, maintains the basic API for compatibility

const selectVariants = cva('');

const selectTriggerVariants = cva(
  'border border-background-300 rounded flex-row items-center overflow-hidden data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[hover=true]:border-background-300',
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
          'border-0 border-b rounded-none data-[hover=true]:border-primary-700 data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_-1px_0_0] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700',
        outline:
          'data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:data-[hover=true]:web:shadow-primary-600 data-[invalid=true]:web:shadow-[inset_0_0_0_1px] data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700 data-[invalid=true]:data-[hover=true]:border-error-700',
        rounded:
          'rounded-full data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'outline',
    },
  }
);

const selectInputVariants = cva(
  'py-auto px-3 placeholder:text-typography-500 web:w-full h-full text-typography-900 pointer-events-none web:outline-none ios:leading-[0px]',
  {
    variants: {
      size: {
        xl: 'text-xl',
        lg: 'text-lg',
        md: 'text-base',
        sm: 'text-sm',
      },
      variant: {
        underlined: 'px-0',
        outline: '',
        rounded: 'px-4',
      },
    },
  }
);

const selectIconVariants = cva(
  'text-background-500 fill-none',
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

type SelectContextValue = {
  size?: 'xl' | 'lg' | 'md' | 'sm';
  variant?: 'underlined' | 'outline' | 'rounded';
};

const SelectContext = React.createContext<SelectContextValue>({});

export type SelectProps = ViewProps & {
  className?: string;
};

const Select = React.forwardRef<React.ElementRef<typeof View>, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(selectVariants(), className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export type SelectTriggerProps = PressableProps &
  VariantProps<typeof selectTriggerVariants> & {
    className?: string;
  };

const SelectTrigger = React.forwardRef<React.ElementRef<typeof Pressable>, SelectTriggerProps>(
  ({ className, size = 'md', variant = 'outline', children, ...props }, ref) => {
    return (
      <SelectContext.Provider value={{ size, variant }}>
        <Pressable
          ref={ref}
          className={cn(selectTriggerVariants({ size, variant }), className)}
          {...props}
        >
          {children}
        </Pressable>
      </SelectContext.Provider>
    );
  }
);

export type SelectInputProps = React.ComponentProps<typeof Text> &
  VariantProps<typeof selectInputVariants> & {
    className?: string;
    placeholder?: string;
  };

const SelectInput = React.forwardRef<React.ElementRef<typeof Text>, SelectInputProps>(
  ({ className, size, variant, placeholder, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    return (
      <Text
        ref={ref}
        className={cn(
          selectInputVariants({
            size: size || context.size || undefined,
            variant: variant || context.variant || undefined,
          }),
          className
        )}
        {...props}
      >
        {children || placeholder}
      </Text>
    );
  }
);

export type SelectIconProps = ViewProps &
  VariantProps<typeof selectIconVariants> & {
    className?: string;
    as?: React.ElementType;
  };

const SelectIcon = React.forwardRef<React.ElementRef<typeof View>, SelectIconProps>(
  ({ className, size, as: Component = View, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    return (
      <Component
        ref={ref}
        className={cn(
          selectIconVariants({
            size: size || context.size || undefined,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

// Placeholder components for compatibility
const SelectPortal: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
const SelectBackdrop: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectContent: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectDragIndicator: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectDragIndicatorWrapper: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectItem: React.FC<PressableProps> = (props) => <Pressable {...props} />;
const SelectScrollView: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectVirtualizedList: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectFlatList: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectSectionList: React.FC<ViewProps> = (props) => <View {...props} />;
const SelectSectionHeaderText: React.FC<React.ComponentProps<typeof Text>> = (props) => <Text {...props} />;

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectInput.displayName = 'SelectInput';
SelectIcon.displayName = 'SelectIcon';

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
};
