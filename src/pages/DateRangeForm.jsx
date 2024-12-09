import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'rsuite';

// Zod schema for date range validation
const dateRangeSchema = z.object({
  startDate: z
    .string()
    .nonempty('Start date is required')
    .refine(val => {
      const [month, year] = val.split('/').map(Number);
      return month >= 1 && month <= 12 && year >= 1900; // Validate month and year
    }, 'Start date must be in MM/YYYY format'),
  endDate: z
    .string()
    .nonempty('End date is required')
    .refine(val => {
      const [month, year] = val.split('/').map(Number);
      return month >= 1 && month <= 12 && year >= 1900; // Validate month and year
    }, 'End date must be in MM/YYYY format')
    .refine((val, ctx) => {
      const [startMonth, startYear] = ctx.parent.startDate
        .split('/')
        .map(Number);
      const [endMonth, endYear] = val.split('/').map(Number);
      if (
        endYear < startYear ||
        (endYear === startYear && endMonth < startMonth)
      ) {
        return false;
      }
      return true;
    }, 'End date cannot be earlier than start date'),
});

const DateRangeForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dateRangeSchema),
  });

  const handleDateChange = (date, fieldName) => {
    if (date) {
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      setValue(fieldName, formattedDate); // Update the form field with the date in MM/YYYY format
    } else {
      setValue(fieldName, '');
    }
  };

  const onSubmit = data => {
    console.log('Form Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="startDate">Start Date (mm/yyyy):</label>
        <DatePicker
          format="MM/yyyy"
          onChange={date => handleDateChange(date, 'startDate')}
          value={undefined} // Controlled input (we'll use the form value for this)
        />
        {errors.startDate && (
          <p style={{ color: 'red' }}>{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate">End Date (mm/yyyy):</label>
        <DatePicker
          format="MM/yyyy"
          onChange={date => handleDateChange(date, 'endDate')}
          value={undefined} // Controlled input (we'll use the form value for this)
        />
        {errors.endDate && (
          <p style={{ color: 'red' }}>{errors.endDate.message}</p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default DateRangeForm;
