import { z } from 'zod/v4'

// ──────────────────────────────────────────────
// 🔹 SHARED ENUMS & CONSTANTS
// ──────────────────────────────────────────────

const FUEL_TYPES = [
  'Diesel',
  'Petrol',
  'Electric',
  'Hybrid',
  'CNG',
  'LPG',
] as const
const CONDITIONS = ['New', 'Used', 'Refurbished', 'Salvage'] as const
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic'] as const
const BODY_TYPES = [
  'Flatbed',
  'Tipper',
  'Tanker',
  'Curtainsider',
  'Refrigerated',
  'Box',
  'Crane',
  'Mixer',
  'Other',
] as const
const TRUCK_SIZES = ['Light', 'Medium', 'Heavy', 'Extra Heavy'] as const
const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp', 'SMS'] as const
const SPARE_CATEGORIES = [
  'Engine',
  'Transmission',
  'Brakes',
  'Suspension',
  'Electrical',
  'Body Parts',
  'Interior',
  'Exterior',
  'Other',
] as const

const SA_PHONE_REGEX = /^0[6-8][0-9]{8}$/
const SA_REG_REGEX = /^[A-Z]{2}\s?\d{3}[- ]?\d{3}\s?[A-Z]{2}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD
const URL_REGEX = /^https?:\/\/.+/i

// ──────────────────────────────────────────────
// 🔹 CONTACT FORM
// ──────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .trim(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/, {
      message: 'Invalid phone number. Use format: +27 83 123 4567',
    })
    .or(z.literal('').optional()), // allow empty if not required
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .trim(),
  branch: z.enum(['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Other'], {
    message: 'Please select a valid branch',
  }),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters' })
    .trim(),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .trim(),
  captchaAnswer: z
    .string()
    .min(1, { message: 'Please answer the math question' }),
})

// ──────────────────────────────────────────────
// 🔹 VEHICLE FORM (THE BIG ONE — FULLY FIXED)
// ──────────────────────────────────────────────

export const vehicleSchema = z
  .object({
    name: z.string().min(2, 'Vehicle name is required').trim(),
    make: z.string().min(1, 'Make is required').trim(),
    model: z.string().min(1, 'Model is required').trim(),
    year: z.coerce
      .number({ message: 'Year must be a valid number' })
      .int()
      .min(1900, { message: 'Year must be after 1900' })
      .max(new Date().getFullYear() + 1, {
        message: `Year cannot be in the future`,
      }),
    vatPrice: z.coerce
      .number({ message: 'VAT price must be a valid number' })
      .min(0, { message: 'Price cannot be negative' }),
    pricenoVat: z.coerce
      .number({ message: 'Price (excl. VAT) must be a valid number' })
      .min(0, { message: 'Price cannot be negative' }),
    mileage: z.coerce
      .number({ message: 'Mileage must be a valid number' })
      .int()
      .min(0, { message: 'Mileage cannot be negative' })
      .max(9999999, { message: 'Mileage seems too high' }),
    fuelType: z.enum(FUEL_TYPES, {
      message: `Fuel type must be one of: ${FUEL_TYPES.join(', ')}`,
    }),
    condition: z.enum(CONDITIONS, {
      message: `Condition must be one of: ${CONDITIONS.join(', ')}`,
    }),
    transmission: z.enum(TRANSMISSIONS, {
      message: `Transmission must be one of: ${TRANSMISSIONS.join(', ')}`,
    }),
    description: z
      .string()
      .min(20, { message: 'Description must be at least 20 characters' })
      .trim(),
    registrationNo: z
      .string()
      .regex(SA_REG_REGEX, {
        message: 'Invalid SA registration number. Format: CA 123-456 GP',
      })
      .trim(),
    bodyType: z.enum(BODY_TYPES, {
      message: `Body type must be one of: ${BODY_TYPES.join(', ')}`,
    }),
    truckSize: z.enum(TRUCK_SIZES, {
      message: `Truck size must be one of: ${TRUCK_SIZES.join(', ')}`,
    }),
    images: z
      .array(
        z.object({
          url: z.string().url({ message: 'Invalid image URL' }),
          fileId: z.string().min(1, 'File ID is required'),
        }),
      )
      .min(1, { message: 'At least 1 image is required' })
      .max(10, { message: 'Maximum 10 images allowed' }),
    videoLink: z
      .string()
      .url({ message: 'Invalid video URL' })
      .or(z.literal(''))
      .optional(),
    specialPrice: z.coerce
      .number()
      .min(0, { message: 'Special price cannot be negative' })
      .optional(),
    specialValidFrom: z
      .string()
      .regex(DATE_REGEX, { message: 'Invalid date. Use format: YYYY-MM-DD' })
      .optional(),
    specialValidTo: z
      .string()
      .regex(DATE_REGEX, { message: 'Invalid date. Use format: YYYY-MM-DD' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.specialValidFrom && data.specialValidTo) {
        return new Date(data.specialValidFrom) <= new Date(data.specialValidTo)
      }
      return true
    },
    { message: 'Valid To date must be after Valid From date' },
  )

// ──────────────────────────────────────────────
// 🔹 TRADE-IN FORM (FULLY FIXED)
// ──────────────────────────────────────────────

export const tradeInFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }).trim(),
  lastName: z.string().min(2, { message: 'Last name is required' }).trim(),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .trim(),
  phone: z
    .string()
    .regex(SA_PHONE_REGEX, {
      message: 'Invalid SA phone number. Format: 083 123 4567',
    }),
  preferredContact: z.enum(CONTACT_METHODS, {
    message: `Preferred contact must be one of: ${CONTACT_METHODS.join(', ')}`,
  }),
  year: z.coerce
    .number({ message: 'Year must be a valid number' })
    .int()
    .min(1990, { message: 'Vehicle year must be 1990 or later' })
    .max(new Date().getFullYear() + 1, {
      message: 'Year cannot be in the future',
    }),
  make: z.string().min(1, { message: 'Make is required' }).trim(),
  model: z.string().min(1, { message: 'Model is required' }).trim(),
  mileage: z.coerce
    .number({ message: 'Mileage must be a valid number' })
    .int()
    .min(0, { message: 'Mileage cannot be negative' })
    .max(9999999, { message: 'Mileage seems too high' }),
  comments: z
    .string()
    .max(500, { message: 'Comments must be under 500 characters' })
    .optional()
    .default(''),
  captchaAnswer: z
    .string()
    .min(1, { message: 'Please answer the math question' }),
})

// ──────────────────────────────────────────────
// 🔹 ENQUIRY FORM (MOSTLY GOOD — MINOR FIXES)
// ──────────────────────────────────────────────

export const enquiryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .trim(),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .trim(),
  phone: z
    .string()
    .regex(SA_PHONE_REGEX, {
      message: 'Invalid SA phone number. Format: 083 123 4567',
    }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .trim(),
  captchaAnswer: z
    .string()
    .min(1, { message: 'Please answer the math question' }),
})

// ──────────────────────────────────────────────
// 🔹 SPARE PARTS FORM (FULLY FIXED)
// ──────────────────────────────────────────────

export const spareSchema = z
  .object({
    name: z.string().min(2, 'Spare part name is required').trim(),
    make: z.string().min(1, 'Make is required').trim(),
    price: z.coerce
      .number({ message: 'Price must be a valid number' })
      .min(0.01, { message: 'Price must be greater than R0.01' }),
    noVatPrice: z.coerce
      .number({ message: 'Price (excl. VAT) must be a valid number' })
      .min(0.01, { message: 'Price must be greater than R0.01' }),
    condition: z.enum(CONDITIONS, {
      message: `Condition must be one of: ${CONDITIONS.join(', ')}`,
    }),
    category: z.enum(SPARE_CATEGORIES, {
      message: `Category must be one of: ${SPARE_CATEGORIES.join(', ')}`,
    }),
    description: z
      .string()
      .min(20, { message: 'Description must be at least 20 characters' })
      .trim(),
    images: z
      .array(
        z.object({
          url: z.string().url({ message: 'Invalid image URL' }),
          fileId: z.string().min(1, 'File ID is required'),
        }),
      )
      .min(1, { message: 'At least 1 image is required' })
      .max(10, { message: 'Maximum 10 images allowed' }),
    videoLink: z
      .string()
      .url({ message: 'Invalid video URL' })
      .or(z.literal(''))
      .optional(),
    specialPrice: z.coerce
      .number()
      .min(0.01, { message: 'Special price must be greater than R0.01' })
      .optional(),
    specialPriceNoVat: z.coerce
      .number()
      .min(0.01, { message: 'Special price must be greater than R0.01' })
      .optional(),
    specialValidFrom: z
      .string()
      .regex(DATE_REGEX, { message: 'Invalid date. Use format: YYYY-MM-DD' })
      .optional(),
    specialValidTo: z
      .string()
      .regex(DATE_REGEX, { message: 'Invalid date. Use format: YYYY-MM-DD' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.specialValidFrom && data.specialValidTo) {
        return new Date(data.specialValidFrom) <= new Date(data.specialValidTo)
      }
      return true
    },
    { message: 'Valid To date must be after Valid From date' },
  )
