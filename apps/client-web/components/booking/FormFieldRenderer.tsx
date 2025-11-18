import React from 'react';
import { Check } from 'lucide-react';
import type { FormField } from '@shared/supabase';

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
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.field_key, e.target.value)}
            placeholder={field.placeholder || ''}
            className={`w-full px-4 py-3 border rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'textarea':
        return (
          <div className="relative">
            <textarea
              value={value || ''}
              onChange={(e) => onChange(field.field_key, e.target.value)}
              placeholder={field.placeholder || ''}
              maxLength={field.max_length || undefined}
              className={`w-full min-h-[120px] px-4 py-3 border rounded-lg text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta resize-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {field.max_length && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {(value || '').length} / {field.max_length}
                </span>
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value?.toString() || ''}
            onChange={(e) => {
              const num = e.target.value === '' ? null : Number(e.target.value);
              if (num === null || !isNaN(num)) {
                onChange(field.field_key, num);
              }
            }}
            placeholder={field.placeholder || ''}
            min={field.min_value || undefined}
            max={field.max_value || undefined}
            className={`w-full px-4 py-3 border rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'select':
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value.toString()}
                  type="button"
                  onClick={() => onChange(field.field_key, option.value)}
                  className={`w-full py-4 px-5 border rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'border-brand-dark bg-gray-100'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 pr-3">
                      <p
                        className={`text-base ${
                          isSelected ? 'font-semibold text-black' : 'text-gray-800'
                        }`}
                      >
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      )}
                    </div>
                    {isSelected && <Check size={20} className="text-brand-dark" strokeWidth={2.5} />}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'checkbox':
        // Handle both single checkbox (boolean) and multiple checkboxes (array)
        const isMultiple = field.options && field.options.length > 1;

        if (!isMultiple) {
          // Single checkbox (toggle)
          const isChecked = !!value;
          return (
            <button
              type="button"
              onClick={() => onChange(field.field_key, !isChecked)}
              className={`w-full py-4 px-5 border rounded-xl flex items-center gap-3 transition-colors ${
                isChecked
                  ? 'border-brand-dark bg-gray-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isChecked ? 'border-brand-dark bg-brand-dark' : 'border-gray-400 bg-white'
                }`}
              >
                {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <span
                className={`text-base flex-1 text-left ${
                  isChecked ? 'font-semibold text-black' : 'text-gray-800'
                }`}
              >
                {field.label}
              </span>
            </button>
          );
        }

        // Multiple checkboxes
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value.toString()}
                  type="button"
                  onClick={() => {
                    const newValues = isChecked
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(field.field_key, newValues);
                  }}
                  className={`w-full py-4 px-5 border rounded-xl flex items-center gap-3 transition-colors ${
                    isChecked
                      ? 'border-brand-dark bg-gray-100'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isChecked ? 'border-brand-dark bg-brand-dark' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-base ${
                        isChecked ? 'font-semibold text-black' : 'text-gray-800'
                      }`}
                    >
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'address':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.field_key, e.target.value)}
            placeholder={field.placeholder || 'Enter address'}
            className={`w-full px-4 py-3 border rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      default:
        return (
          <p className="text-sm text-gray-500">
            Field type &quot;{field.field_type}&quot; not implemented
          </p>
        );
    }
  };

  return (
    <div className="mb-6">
      {/* Label (skip for single checkbox as it's rendered inline) */}
      {!(field.field_type === 'checkbox' && (!field.options || field.options.length === 1)) && (
        <div className="flex items-start mb-2">
          <label className="text-base font-semibold text-brand-dark flex-1">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>
        </div>
      )}

      {/* Description */}
      {field.description && field.field_type !== 'checkbox' && (
        <p className="text-sm text-gray-600 mb-3">{field.description}</p>
      )}

      {/* Field Input */}
      {renderField()}

      {/* Error message */}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
