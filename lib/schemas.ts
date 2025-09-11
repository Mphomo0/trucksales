import { z } from 'zod/v4'

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // Regex for validating international and local phone numbers
    {
      message: 'Invalid phone number.',
    }
  ),
  email: z.email({ message: 'Invalid email address' }),
  branch: z.string().min(1, { message: 'Select a branch' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
})

export const vehicleSchema = z.object({
  name: z
    .string()
    .min(2, 'Vehicle name is required')
    .transform((val) => val.trim()),
  make: z
    .string()
    .min(1, 'Make is required')
    .transform((val) => val.trim()),
  model: z
    .string()
    .min(1, 'Model is required')
    .transform((val) => val.trim()),
  year: z.coerce.number<number>(),
  vatPrice: z.coerce.number<number>(),
  pricenoVat: z.coerce.number<number>(),
  mileage: z.coerce.number<number>(),
  fuelType: z.string().min(1, 'Fuel type is required'),
  condition: z.string().min(1, 'Condition is required'),
  transmission: z.string().min(1, 'Transmission type is required'),
  description: z
    .string()
    .min(1, 'Enter Your Description')
    .transform((val) => val.trim()),
  registrationNo: z
    .string()
    .min(1, 'Enter Vehicle Registration Number')
    .transform((val) => val.trim()),
  bodyType: z
    .string()
    .min(1, 'Enter Your Truck Body Type')
    .transform((val) => val.trim()),
  truckSize: z
    .string()
    .min(1, 'Enter Your Truck Size')
    .transform((val) => val.trim()),
  images: z.array(
    z.object({
      url: z.url(),
      fileId: z.string().min(1, 'File ID is required'),
    })
  ),
  videoLink: z.string().optional(),
})

export const tradeInFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .transform((val) => val.trim()),
  email: z.email({ message: 'Invalid email address' }),
  phone: z.string().regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // Regex for validating international and local phone numbers
    {
      message: 'Invalid phone number.',
    }
  ),
  preferredContact: z
    .string()
    .min(1, { message: 'Preferred contact method is required' }),
  year: z.string().min(1, { message: 'Please select your vehicle year' }),
  make: z
    .string()
    .min(1, { message: 'Make is required' })
    .transform((val) => val.trim()),
  model: z
    .string()
    .min(1, { message: 'Model is required' })
    .transform((val) => val.trim()),
  mileage: z.string().min(1, { message: 'Mileage is required' }),
})

export const enquiryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .regex(/^0[6-8][0-9]{8}$/, { message: 'Invalid SA phone number.' }),
  message: z.string().min(10, { message: 'Message is required' }),
})

export const spareSchema = z.object({
  name: z
    .string()
    .min(2, 'Spare part name is required')
    .transform((val) => val.trim()),
  make: z
    .string()
    .min(1, 'Make is required')
    .transform((val) => val.trim()),
  price: z.coerce.number<number>(),
  condition: z.string().min(1, 'Condition is required'),
  category: z.string().min(1, 'Category is required'),
  description: z
    .string()
    .min(1, 'Enter Your Description')
    .transform((val) => val.trim()),
  images: z.array(
    z.object({
      url: z.url(),
      fileId: z.string().min(1, 'File ID is required'),
    })
  ),
  videoLink: z.string().optional(),
})
