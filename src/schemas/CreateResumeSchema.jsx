import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

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
  position: z.string().min(5, { message: 'Enter the position' }),
  salaryRange: z.string().min(1, { message: 'Choose a salary range' }),
  experience: z.string().min(1, { message: 'Choose an experience' }),
  jobCategory: z.string().min(1, { message: 'Choose a category' }),
  portfolio: z.string().optional(),
  work: z.array(
    z.object({
      skills: z
        .string()
        .min(1, 'Навыки обязательны для заполнения')
        .min(5, 'Навыки должны содержать минимум 5 символов'),
      company: z.string().min(1, 'Компания обязательна для заполнения'),
      position: z.string().min(1, 'Позиция обязательна для заполнения'),
      city: z.string().min(1, 'Город обязателен для заполнения'),
      dateRange: z
        .object({
          startDate: z
            .custom(val => val instanceof Timestamp, {
              message: 'Start date must be a valid Timestamp',
            })
            .refine(
              date => date instanceof Timestamp,
              'Start date must be a valid Firebase Timestamp'
            ),
          endDate: z
            .custom(val => !val || val instanceof Timestamp, {
              message: 'End date must be a valid Timestamp or null',
            })
            .nullable()
            .optional(),
        })
        .refine(
          dateRange => {
            if (dateRange.startDate && dateRange.endDate) {
              return dateRange.startDate.seconds <= dateRange.endDate.seconds;
            }
            return true;
          },
          {
            message: 'End Date must be after Start Date',
            path: ['dateRange.endDate'],
          }
        ),
      stillWorks: z.boolean().optional(),
    })
  ),
  education: z.array(
    z.object({
      university: z.string().min(1, 'enter a instituinon'),
      degree: z.string().min(1, 'enter a degree'),
      faculty: z.string().min(1, 'enter a faculty'),
      city: z.string().min(1, 'enter the city of uni'),
      dateRange: z
        .object({
          startDate: z
            .custom(val => val instanceof Timestamp, {
              message: 'Start date must be a valid Timestamp',
            })
            .refine(
              date => date instanceof Timestamp,
              'Start date must be a valid Firebase Timestamp'
            ),
          endDate: z
            .custom(val => !val || val instanceof Timestamp, {
              message: 'End date must be a valid Timestamp or null',
            })
            .nullable()
            .optional(),
        })
        .refine(
          dateRange => {
            if (dateRange.startDate && dateRange.endDate) {
              return dateRange.startDate.seconds <= dateRange.endDate.seconds;
            }
            return true;
          },
          {
            message: 'End Date must be after Start Date',
            path: ['dateRange.endDate'],
          }
        ),
      stillStudy: z.boolean().optional(),
    })
  ),
  language: z.array(
    z.object({
      langChoice: z.string().min(1, 'Required'),
      langLevel: z.string().min(1, 'Required'),
    })
  ),
  profilePicture: z.string().optional(),
});
