import * as Yup from 'yup';

export const CreateResumeSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  surname: Yup.string()
    .min(3, 'Surname must be at least 3 characters')
    .required('Surname is required'),
});
