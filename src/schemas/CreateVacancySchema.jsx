import * as Yup from 'yup';

export const CreateVacancySchema = Yup.object().shape({
  firstName: Yup.string().required('Имя обязательно'),
  lastName: Yup.string().required('Фамилия обязательна'),
  birthDate: Yup.object().shape({
    day: Yup.string().required('День обязателен'),
    month: Yup.string().required('Месяц обязателен'),
    year: Yup.string().required('Год обязателен'),
  }),
  gender: Yup.string().required('Пол обязателен'),
  city: Yup.string().required('Город обязателен'),
  willingToRelocate: Yup.boolean(),
  contactNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Введите корректный номер телефона')
    .required('Контакт обязателен'),
  email: Yup.string()
    .email('Некорректный адрес почты')
    .required('Почта обязательна'),
  desiredPosition: Yup.string().required('Должность обязательна'),
  salaryRange: Yup.string().required('Укажите уровень дохода'),
  experience: Yup.string().required('Укажите ваш опыт'),
  workHistory: Yup.array().of(
    Yup.object().shape({
      skills: Yup.string().required('Навыки обязательны'),
      company: Yup.string().required('Компания обязательна'),
      position: Yup.string().required('Профессия обязательна'),
      city: Yup.string().required('Город обязателен'),
      startDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Формат должен быть mm/yyyy')
        .required('Дата начала обязательна'),
      endDate: Yup.string().matches(
        /^(0[1-9]|1[0-2])\/\d{4}$/,
        'Формат должен быть mm/yyyy'
      ),
      ongoing: Yup.boolean(),
      achievements: Yup.string(),
    })
  ),
  education: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().required('Учебное заведение обязательно'),
      degree: Yup.string().required('Степень обязательна'),
      faculty: Yup.string().required('Факультет обязателен'),
      city: Yup.string().required('Город обязателен'),
      startDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Формат должен быть mm/yyyy')
        .required('Дата начала обязательна'),
      endDate: Yup.string().matches(
        /^(0[1-9]|1[0-2])\/\d{4}$/,
        'Формат должен быть mm/yyyy'
      ),
    })
  ),
});
