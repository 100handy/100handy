import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native'; import { Check } from 'lucide-react-native'; import { Input, InputField } from '@/components/ui/input'; import type { FormField, FormResponse } from '@shared/supabase';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (fieldKey: string, value: any) => void;
  error?: string;
}

export function FormFieldRenderer({ field, value, onChange, error }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            variant="outline"
            size="xl"
            className="border-gray-200 rounded-xl min-h-[56px]"
            isInvalid={!!error}
          >
            <InputField
              value={value || ''}
              onChangeText={(text) => onChange(field.field_key, text)}
              placeholder={field.placeholder || ''}
              className="text-base px-4 text-black"
            />
          </Input>
        );

      case 'textarea':
        return (
          <TextInput
            value={value || ''}
            onChangeText={(text) => onChange(field.field_key, text)}
            placeholder={field.placeholder || ''}
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            maxLength={field.max_length || undefined}
            className="bg-gray-50 rounded-lg px-4 py-3 text-base text-[#30352D]"
            style={{
              minHeight: 120,
              borderWidth: error ? 2 : 1,
              borderColor: error ? '#EF4444' : '#E5E7EB',
            }}
          />
        );

      case 'number':
        return (
          <Input
            variant="outline"
            size="xl"
            className="border-gray-200 rounded-xl min-h-[56px]"
            isInvalid={!!error}
          >
            <InputField
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const num = text === '' ? null : Number(text);
                if (!isNaN(num as number)) {
                  onChange(field.field_key, num);
                }
              }}
              placeholder={field.placeholder || ''}
              keyboardType="numeric"
              className="text-base px-4 text-black"
            />
          </Input>
        );

      case 'select':
      case 'radio':
        return (
          <View className="flex-col gap-2">
            {field.options?.map((option) => {
              const isSelected = value === option.value;
              return (
                <Pressable
                  key={option.value.toString()}
                  onPress={() => onChange(field.field_key, option.value)}
                  className={`
                    py-4 px-5 border rounded-xl
                    ${isSelected ? 'border-[#30352D] bg-gray-100' : 'border-gray-300 bg-white'}
                  `}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-col flex-1 pr-3">
                      <Text className={`text-base ${isSelected ? 'font-semibold text-black' : 'text-gray-800'}`}>
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </Text>
                      )}
                    </View>
                    {isSelected && (
                      <Check size={20} color="#30352D" strokeWidth={2.5} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        );

      case 'checkbox':
        // Handle both single checkbox (boolean) and multiple checkboxes (array)
        const isMultiple = field.options && field.options.length > 1;

        if (!isMultiple) {
          // Single checkbox (toggle)
          const isChecked = !!value;
          return (
            <Pressable
              onPress={() => onChange(field.field_key, !isChecked)}
              className={`
                py-4 px-5 border rounded-xl flex-row items-center gap-3
                ${isChecked ? 'border-[#30352D] bg-gray-100' : 'border-gray-300 bg-white'}
              `}
            >
              <View className={`
                w-5 h-5 rounded border-2 items-center justify-center
                ${isChecked ? 'border-[#30352D] bg-[#30352D]' : 'border-gray-400 bg-white'}
              `}>
                {isChecked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text className={`text-base flex-1 ${isChecked ? 'font-semibold text-black' : 'text-gray-800'}`}>
                {field.label}
              </Text>
            </Pressable>
          );
        }

        // Multiple checkboxes
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <View className="flex-col gap-2">
            {field.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <Pressable
                  key={option.value.toString()}
                  onPress={() => {
                    const newValues = isChecked
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(field.field_key, newValues);
                  }}
                  className={`
                    py-4 px-5 border rounded-xl flex-row items-center gap-3
                    ${isChecked ? 'border-[#30352D] bg-gray-100' : 'border-gray-300 bg-white'}
                  `}
                >
                  <View className={`
                    w-5 h-5 rounded border-2 items-center justify-center
                    ${isChecked ? 'border-[#30352D] bg-[#30352D]' : 'border-gray-400 bg-white'}
                  `}>
                    {isChecked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <View className="flex-col flex-1">
                    <Text className={`text-base ${isChecked ? 'font-semibold text-black' : 'text-gray-800'}`}>
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        );

      case 'address':
        // Address field - similar to text but could be enhanced with autocomplete
        return (
          <Input
            variant="outline"
            size="xl"
            className="border-gray-200 rounded-xl min-h-[56px]"
            isInvalid={!!error}
          >
            <InputField
              value={value || ''}
              onChangeText={(text) => onChange(field.field_key, text)}
              placeholder={field.placeholder || 'Enter address'}
              className="text-base px-4 text-black"
            />
          </Input>
        );

      default:
        return (
          <Text className="text-sm text-gray-500">
            Field type "{field.field_type}" not implemented
          </Text>
        );
    }
  };

  return (
    <View className="flex-col mb-6">
      {/* Label (skip for single checkbox as it's rendered inline) */}
      {!(field.field_type === 'checkbox' && (!field.options || field.options.length === 1)) && (
        <View className="flex-row items-start mb-2">
          <Text className="text-base font-semibold text-[#30352D] flex-1">
            {field.label}
            {field.required && <Text className="text-red-500"> *</Text>}
          </Text>
        </View>
      )}

      {/* Description */}
      {field.description && field.field_type !== 'checkbox' && (
        <Text className="text-sm text-gray-600 mb-3">
          {field.description}
        </Text>
      )}

      {/* Field Input */}
      {renderField()}

      {/* Character count for textarea */}
      {field.field_type === 'textarea' && field.max_length && (
        <Text className="text-xs text-gray-500 mt-1">
          {(value || '').length} / {field.max_length} characters
        </Text>
      )}

      {/* Error message */}
      {error && (
        <Text className="text-sm text-red-500 mt-2">
          {error}
        </Text>
      )}
    </View>
  );
}
