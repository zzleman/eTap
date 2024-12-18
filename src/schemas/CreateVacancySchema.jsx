import { z } from 'zod';

export const schema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(50, { message: 'Title must not exceed 50 characters' }),

  category: z.string().min(1, 'required!'),

  salary: z
    .string()
    .regex(/^\d+$/, { message: 'Salary must be a number' })
    .min(1, 'required!'),

  workShift: z
    .string()
    .min(1, { message: 'Job shift is required' }) // Ensures the field is not empty
    .refine(val => ['morning', 'afternoon', 'evening'].includes(val), {
      message: 'Invalid work shift',
    }),

  experience: z
    .string()
    .min(1, { message: 'Job shift is required' })
    .refine(val => ['<1', '1-3', '3-5', '>5'].includes(val), {
      message: 'Invalid experience level',
    }),

  education: z
    .string()
    .min(1, { message: 'Job shift is required' })
    .refine(
      val => ['undergraduate', 'bachelor', 'master', 'phd'].includes(val),
      {
        message: 'Invalid education level',
      }
    ),

  jobType: z
    .string()
    .min(1, { message: 'Job shift is required' })
    .refine(val => ['full-time', 'part-time'].includes(val), {
      message: 'Invalid job type',
    }),

  jobDescription: z
    .string()
    .min(10, { message: 'Job description must be at least 10 characters' })
    .max(3000, { message: 'Job description must not exceed 3000 characters' }),
});
