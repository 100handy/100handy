import { z } from 'zod';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';

// Phone number validation - just digits, reasonable length (without country code)
const phoneRegex = /^\d{6,15}$/;

// Validate postcode based on country code
export const validatePostcode = (postcode: string, countryCode: string): boolean => {
  if (!postcode || postcode.trim() === '') return false;

  // Check if validation exists for this country
  if (postcodeValidatorExistsForCountry(countryCode)) {
    return postcodeValidator(postcode, countryCode);
  }

  // For countries without specific validation, just check minimum length
  return postcode.trim().length >= 2;
};

export const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

const parseDateOfBirth = (dateString: string): Date | null => {
  const [day, month, year] = dateString.split('/').map(Number);
  if (!day || !month || !year) {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  return birthDate;
};

const isValidDateOfBirth = (dateString: string): boolean => parseDateOfBirth(dateString) !== null;

// Helper to validate age 18+
const isAtLeast18 = (dateString: string): boolean => {
  const birthDate = parseDateOfBirth(dateString);
  if (!birthDate) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age >= 18;
};

const optionalDateOfBirthSchema = z.string()
  .refine(
    (value) => value.trim() === '' || /^\d{2}\/\d{2}\/\d{4}$/.test(value),
    'Please enter a valid date (DD/MM/YYYY)'
  )
  .refine(
    (value) => value.trim() === '' || isValidDateOfBirth(value),
    'Please enter a valid date (DD/MM/YYYY)'
  )
  .refine(
    (value) => value.trim() === '' || isAtLeast18(value),
    'You must be at least 18 years old to sign up'
  );

// Base schema without country-specific validation
export const signUpSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid phone number (digits only)'),
  postcode: z.string()
    .min(1, 'Postcode is required')
    .min(2, 'Postcode must be at least 2 characters'),
});

export const signUpWithDateOfBirthSchema = signUpSchema.extend({
  dateOfBirth: optionalDateOfBirthSchema,
});

export const mobileSignUpSchema = signUpSchema.extend({
  phone: z.string()
    .refine(
      (value) => value.trim() === '' || phoneRegex.test(value),
      'Please enter a valid phone number (digits only)'
    ),
  postcode: z.string()
    .refine(
      (value) => value.trim() === '' || value.trim().length >= 2,
      'Postcode must be at least 2 characters'
    ),
});

export const mobileSignUpWithDateOfBirthSchema = mobileSignUpSchema.extend({
  dateOfBirth: optionalDateOfBirthSchema,
});

// Factory function to create schema with country-specific postcode validation
export const createSignUpSchema = (countryCode: string) => {
  return signUpSchema.refine(
    (data) => validatePostcode(data.postcode, countryCode),
    {
      message: `Please enter a valid postcode for ${countryCode}`,
      path: ['postcode'],
    }
  );
};

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const otpSchema = z.object({
  code: z.string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignUpWithDateOfBirthFormData = z.infer<typeof signUpWithDateOfBirthSchema>;
export type MobileSignUpFormData = z.infer<typeof mobileSignUpSchema>;
export type MobileSignUpWithDateOfBirthFormData = z.infer<typeof mobileSignUpWithDateOfBirthSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
