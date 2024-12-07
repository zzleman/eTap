import { z } from 'zod';
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const days = Array.from({ length: 31 }, (_, i) => i + 1);
export const years = Array.from(
  { length: 65 },
  (_, i) => new Date().getFullYear() - i
);
export const formCities = ['Baku', 'Sumgayit', 'Ganja', 'Nakhcivan'];
export const schema = z.object({
  name: z.string().min(3),
  surname: z.string().min(3),
  birthDay: z
    .object({
      day: z.number().min(1, 'Day is required').max(31, 'Invalid day'),
      month: z
        .enum(months, { message: 'Invalid month' })
        .refine(month => months.includes(month), 'Month is required'),
      year: z
        .number()
        .min(1900, 'Year is required')
        .max(new Date().getFullYear(), 'Invalid year'),
    })
    .refine(data => data.day && data.month && data.year, {
      message: 'Please fill all date fields.',
      path: ['birthDay'],
    }),
  gender: z.string().min(1, { message: 'Choose a gender' }),
  city: z
    .enum(formCities, { message: 'Invalid city' })
    .refine(city => formCities.includes(city), 'City is required'),
  willingToRelocate: z.boolean().default(false),
  contact: z.object({
    dialCode: z.string(),
    phone: z.string().min(9).max(9),
  }),
  email: z.string().email('Invalid email address'),
  position: z.string().min(5, {
    message: 'Enter the position',
  }),
  salaryRange: z.string().min(1, { message: 'Choose a salary range' }),
  experience: z.string().min(1, { message: 'Choose an experience ' }),
});
