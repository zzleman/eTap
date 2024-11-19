import * as Yup from 'yup';

export const CreateVacancySchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must not exceed 50 characters')
    .required('Title is required'),
  category: Yup.string().required('Category is required'),
  salary: Yup.string()
    .matches(/^\d+$/, 'Salary must be a number')
    .required('Salary is required'),
  workShift: Yup.string()
    .oneOf(['morning', 'afternoon', 'evening'], 'Invalid work shift')
    .required('Work shift is required'),
  experience: Yup.string()
    .oneOf(['<1', '1-3', '3-5', '>5'], 'Invalid experience level')
    .required('Experience is required'),
  education: Yup.string()
    .oneOf(
      ['undergraduate', 'bachelor', 'master', 'phd'],
      'Invalid education level'
    )
    .required('Education is required'),
  jobType: Yup.string()
    .oneOf(['full-time', 'part-time'], 'Invalid job type')
    .required('Job type is required'),
  jobDescription: Yup.string()
    .min(10, 'Job description must be at least 10 characters')
    .max(1000, 'Job description must not exceed 1000 characters')
    .required('Job description is required'),
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters')
    .required('Company name is required'),
  location: Yup.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters')
    .required('Location is required'),
  companyLogo: Yup.mixed()
    .nullable()
    .test('fileType', 'Only image files are allowed', value =>
      value
        ? ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
        : true
    )
    .test('fileSize', 'File size must be less than 2MB', value =>
      value ? value.size <= 2 * 1024 * 1024 : true
    ),
  companyDescription: Yup.string()
    .min(10, 'Company description must be at least 10 characters')
    .max(1000, 'Company description must not exceed 1000 characters')
    .required('Company description is required'),
});
