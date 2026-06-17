import { z } from 'zod'

/**
 * Email validation schema
 * Validates email format with custom error message
 */
export const emailSchema = z.string().email('Invalid email address')

/**
 * Password validation schema
 * Requires minimum 8 characters
 */
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

/**
 * Required string validation schema
 * Ensures field is not empty
 */
export const requiredStringSchema = z.string().min(1, 'This field is required')

/**
 * Optional string validation schema
 * Allows empty or undefined values
 */
export const optionalStringSchema = z.string().optional()
