import { z } from 'zod';
import { sanitizeInput, validatePasswordStrength } from './security';

// Enhanced validation schemas with security measures
export const EnhancedLoginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(sanitizeInput),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .refine((password) => {
      const validation = validatePasswordStrength(password);
      return validation.isValid;
    }, 'Password does not meet security requirements'),
});

export const EnhancedRegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(sanitizeInput),
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional()
    .transform((email) => email ? sanitizeInput(email) : undefined),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .refine((password) => {
      const validation = validatePasswordStrength(password);
      return validation.isValid;
    }, 'Password does not meet security requirements'),
  cpassword: z.string(),
}).refine((data) => data.password === data.cpassword, {
  message: "Passwords don't match",
  path: ["cpassword"],
});

export const EnhancedThreadSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeInput),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be less than 10,000 characters')
    .transform(sanitizeInput),
  tags: z
    .string()
    .optional()
    .transform((tags) => {
      if (!tags) return [];
      return tags
        .split(',')
        .map(tag => sanitizeInput(tag.trim()))
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Limit to 5 tags
    }),
});

export const EnhancedChainSchema = z.object({
  name: z
    .string()
    .min(3, 'Chain name must be at least 3 characters')
    .max(50, 'Chain name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Chain name can only contain letters, numbers, spaces, underscores, and hyphens')
    .transform(sanitizeInput),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform((desc) => desc ? sanitizeInput(desc) : undefined),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  postPolicy: z.enum(['VERIFIED_ONLY', 'MODERATORS_ONLY', 'LEVEL_BASED']),
  minAge: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : undefined)
    .refine((val) => val === undefined || (val >= 13 && val <= 100), 'Minimum age must be between 13 and 100'),
  maxAge: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : undefined)
    .refine((val) => val === undefined || (val >= 13 && val <= 100), 'Maximum age must be between 13 and 100'),
  tags: z
    .string()
    .optional()
    .transform((tags) => {
      if (!tags) return [];
      return tags
        .split(',')
        .map(tag => sanitizeInput(tag.trim()))
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Limit to 5 tags
    }),
}).refine((data) => {
  if (data.minAge && data.maxAge && data.minAge >= data.maxAge) {
    return false;
  }
  return true;
}, {
  message: "Minimum age must be less than maximum age",
  path: ["maxAge"],
});

export const EnhancedVerificationSchema = z.object({
  name: z
    .string()
    .min(4, 'Full name must be at least 4 characters')
    .max(40, 'Full name must be less than 40 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .transform(sanitizeInput),
  school: z
    .string()
    .min(10, 'School name must be at least 10 characters')
    .max(200, 'School name must be less than 200 characters')
    .transform(sanitizeInput),
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional()
    .transform((email) => email ? sanitizeInput(email) : undefined),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 100;
    }, 'Age must be between 13 and 100'),
  ref: z
    .string()
    .optional()
    .transform((ref) => ref ? sanitizeInput(ref) : undefined),
});

// Input sanitization for search queries
export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query must be less than 100 characters')
    .transform(sanitizeInput)
    .refine((query) => !/[<>'"]/.test(query), 'Invalid characters in search query'),
});

// Pagination validation
export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const page = parseInt(val || '1');
      return Math.max(1, Math.min(100, page)); // Limit to 1-100 pages
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const limit = parseInt(val || '20');
      return Math.max(1, Math.min(100, limit)); // Limit to 1-100 items per page
    }),
});

// File upload validation
export const FileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      return allowedTypes.includes(file.type);
    }, 'File type not allowed'),
});

// Type exports
export type EnhancedLoginData = z.infer<typeof EnhancedLoginSchema>;
export type EnhancedRegisterData = z.infer<typeof EnhancedRegisterSchema>;
export type EnhancedThreadData = z.infer<typeof EnhancedThreadSchema>;
export type EnhancedChainData = z.infer<typeof EnhancedChainSchema>;
export type EnhancedVerificationData = z.infer<typeof EnhancedVerificationSchema>;
export type SearchQueryData = z.infer<typeof SearchQuerySchema>;
export type PaginationData = z.infer<typeof PaginationSchema>;
export type FileUploadData = z.infer<typeof FileUploadSchema>;
