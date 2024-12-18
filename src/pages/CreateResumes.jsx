import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'rsuite/dist/rsuite.min.css';
import profilePhoto from '../assets/img/user.png';
import {
  FormDropdown,
  FormField,
  FormSelect,
  StyledForm,
} from '../components/Styled/Styled';
import { toast } from 'react-toastify';
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { formCities, schema } from '../schemas/CreateResumeSchema';
import { days, months, years } from '../schemas/CreateResumeSchema';
import { languageLevels, languageChoices } from '../utils/mockUtils';
import { addInfo, deleteInfo } from '../utils/formUtils';
import docIcon from '../assets/icon/doc.png';
import educationIcon from '../assets/icon/education.png';
import languageIcon from '../assets/icon/language.png';
import axios from 'axios';
import { DatePicker } from 'rsuite';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import Loading from '../components/Loading/Loading';

const CreateResumes = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const [loading, setLoading] = useState(true);
  const [dialCode, setDialCode] = useState([]);
  const uniqueDialCodes = [...new Set(dialCode)];
  const [profilePic, setProfilePic] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    work: [],
    education: [],
    language: [],
  });

  const fetchDialCodes = async () => {
    try {
      const response = await axios.get(
        'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
      );
      const data = response.data;
      const dialCode = data.map(country => country.dial_code);
      setDialCode(dialCode);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUrlChange = e => {
    setUrlPath(e.target.value);
  };

  const addProfilePic = () => {
    setProfilePic(urlPath);
  };

  const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'JobCategories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dateRange: {
        startDate: null,
        endDate: null,
      },
    },
  });

  function removeUndefinedFields(obj) {
    if (Array.isArray(obj)) {
      return obj.map(removeUndefinedFields);
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = removeUndefinedFields(value);
        }
        return acc;
      }, {});
    }
    return obj;
  }
  const setNestedValues = (data, parentKey = '') => {
    Object.entries(data).forEach(([key, value]) => {
      const fieldName = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        setNestedValues(value, fieldName);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            setNestedValues(item, `${fieldName}[${index}]`);
          } else {
            setValue(`${fieldName}[${index}]`, item || '');
          }
        });
      } else {
        setValue(fieldName, value || '');
      }
    });
  };
  const fetchResume = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const resumes = userData.resumes || {};

        const [resumeId, resumeData] = Object.entries(resumes)?.[0] || [];
        if (resumeData) {
          const profilePicUrl = resumeData.profilePicture || '';
          setProfilePic(profilePicUrl);
          setUrlPath(profilePicUrl);
          setValue('profilePicture', profilePicUrl);
          setNestedValues(resumeData);
          reset(resumeData);
        }
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async data => {
    if (!userId) {
      toast.error('User not authenticated!', { position: 'top-center' });
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', userId);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        toast.error('User not found!', { position: 'top-center' });
        return;
      }

      let resumes = userSnapshot.data().resumes || {};

      const resumeId = Object.keys(resumes)[0] || Date.now().toString();

      const updatedResume = {
        vacancyId: resumeId,
        ...removeUndefinedFields(data),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, {
        [`resumes.${resumeId}`]: updatedResume,
      });

      const resumeRef = doc(db, 'resumes', resumeId);
      const resumeSnapshot = await getDoc(resumeRef);

      if (resumeSnapshot.exists()) {
        await updateDoc(resumeRef, updatedResume);
      } else {
        await setDoc(resumeRef, {
          ...updatedResume,
          userId: userId,
          createdAt: serverTimestamp(),
        });
      }
      toast.success('Resume updated successfully!', { position: 'top-center' });
      reset();
      fetchResume();
    } catch (error) {
      toast.error('Failed to update resume!', { position: 'bottom-center' });
      console.error('Error submitting resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const debugErrors = () => {
    console.log('Errors:', errors);
  };

  const toggleCheckboxWork = index => {
    const updatedWorkData = formData.work?.map((work, idx) =>
      idx === index ? { ...work, stillWorks: !work.stillWorks } : work
    );
    setFormData(prev => ({
      ...prev,
      work: updatedWorkData,
    }));
  };

  const toggleCheckboxEdu = index => {
    const updatedEduData = formData.education.map((education, idx) =>
      idx === index
        ? { ...education, stillStudy: !education.stillStudy }
        : education
    );
    setFormData(prev => ({
      ...prev,
      education: updatedEduData,
    }));
  };

  useEffect(() => {
    fetchDialCodes();
    getCategories();
    fetchResume();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }
  return (
    <div className="px-36">
      <p>home/ vakansiya / dizayn</p>
      <form onSubmit={handleSubmit(onSubmit, debugErrors)}>
        <div className="form-main w-12/12 flex gap-24">
          <div className="left w-6/12">
            <h1 className="text-[28px] font-bold mt-8">Заполните резюме</h1>
            <div className="resume-details grid grid-cols-12 gap-5 my-8">
              <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold">Имя*</label>
                <FormField
                  placeholder="Джавид"
                  type="text"
                  {...register('name')}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold">Фамилия*</label>
                <FormField
                  placeholder="Гасанов"
                  type="text"
                  {...register('surname')}
                />
                {errors.surname && (
                  <div className="text-red-500">{errors.surname.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-12">
                <label className="font-semibold">Дата рождения*</label>
                <div className="date-select grid grid-cols-12 gap-5">
                  <FormSelect
                    className="col-span-4"
                    {...register('birthDay.day', { valueAsNumber: true })}
                  >
                    <option value="">День</option>
                    {days.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.birthDay?.day && (
                    <div className="text-red-500">
                      {errors.birthDay.day.message}
                    </div>
                  )}

                  <FormSelect
                    className="col-span-4"
                    {...register('birthDay.month')}
                  >
                    <option value="">Месяц</option>
                    {months.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.birthDay?.month && (
                    <div className="text-red-500">
                      {errors.birthDay.month.message}
                    </div>
                  )}

                  <FormSelect
                    className="col-span-4"
                    {...register('birthDay.year', { valueAsNumber: true })}
                  >
                    <option value="">Год</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.birthDay?.year && (
                    <div className="text-red-500">
                      {errors.birthDay.year.message}
                    </div>
                  )}
                </div>
                {errors.birthDay && (
                  <div className="text-red-500">{errors.birthDay.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold">Пол*</label>
                <FormSelect {...register('gender')}>
                  <option value="">Укажите пол</option>
                  <option value="female">Женщина</option>
                  <option value="male">Мужчина</option>
                </FormSelect>
                {errors.gender && (
                  <div className="text-red-500">{errors.gender.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-12">
                <label className="font-semibold" htmlFor="">
                  Город проживания*
                </label>
                <div className="location grid grid-cols-12 gap-5">
                  <FormSelect className="col-span-6" {...register('city')}>
                    <option value="">Укажите город</option>
                    {formCities && formCities.length > 0 ? (
                      formCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))
                    ) : (
                      <option disabled>Нет доступных городов</option>
                    )}
                  </FormSelect>
                  {errors.city && (
                    <div className="text-red-500">{errors.city.message}</div>
                  )}
                  <div className="flex text-nowrap items-center gap-3 px-5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="willingToRelocate"
                        {...register('willingToRelocate')}
                        className="form-checkbox"
                      />
                      <label htmlFor="willingToRelocate" className="text-sm">
                        Я готов работать за границей
                      </label>
                    </div>

                    {errors.willingToRelocate && (
                      <div className="text-red-500 text-sm">
                        {errors.willingToRelocate.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="resume-item col-span-8 flex flex-col gap-3">
                <label className="font-semibold">Контакты*</label>
                <div className="flex border h-10">
                  <FormSelect
                    {...register('contact.dialCode')}
                    className="bg-[#563D7C] text-white w-24 px-5 text-sm"
                  >
                    {uniqueDialCodes
                      .sort((a, b) => a.localeCompare(b))
                      .map(code => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                  </FormSelect>

                  <input
                    {...register('contact.phone')}
                    className="px-7 outline-none"
                    type="text"
                    placeholder="Укажите номер телефона"
                  />
                  {errors.contact?.phone && (
                    <div className="text-red-500">
                      {errors.contact.phone.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-8">
                <label className="font-semibold">Почтовый адресс</label>
                <FormField
                  placeholder="Введите адресс электронной почты"
                  {...register('email')}
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-8">
                <label className="font-semibold">Category*</label>
                <FormSelect
                  placeholder="Название должности"
                  {...register('jobCategory')}
                >
                  <option value="">select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.jobCategory && (
                  <div className="text-red-500">
                    {errors.jobCategory.message}
                  </div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-8">
                <label className="font-semibold">
                  Какую должность вы хотите занимать*
                </label>
                <FormField
                  placeholder="Название должности"
                  {...register('position')}
                />
                {errors.position && (
                  <div className="text-red-500">{errors.position.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-5">
                <label>Уровень дохода вы рассматриваете (Руб)*</label>
                <FormSelect {...register('salaryRange')}>
                  <option value="">З/п</option>
                  <option value="0-500">0-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000-2000">1000-2000</option>
                  <option value="2000-5000">2000-5000</option>
                  <option value="5000+">5000+</option>
                </FormSelect>
                {errors.salaryRange && (
                  <div className="text-red-500">
                    {errors.salaryRange.message}
                  </div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-9">
                <label htmlFor="">Опыт</label>
                <FormSelect {...register('experience')}>
                  <option value="<1">Менее 1 года</option>
                  <option value="1-3">1-3 года</option>
                  <option value="3-5">3-5 года</option>
                  <option value=">5">Более 5 лет</option>
                </FormSelect>
              </div>
            </div>

            <div className="advanced-areas flex flex-col gap-5">
              <div className="advanced-item w-[635px] text-nowrap">
                <FormDropdown>
                  <div className="flex gap-4">
                    <img className="size-6" src={docIcon} alt="" />
                    <p>Опыт работы</p>
                  </div>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      addInfo('work', formData, setFormData);
                    }}
                  >
                    +Добавить
                  </p>
                </FormDropdown>
                {formData.work ? (
                  formData.work.map((work, index) => {
                    return (
                      <div key={index} className="advanced-open">
                        <StyledForm>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">
                              Навыки/знания
                            </label>
                            <FormField
                              {...register(`work[${index}].skills`)}
                              placeholder="Выберите навыки/знания"
                            />
                            {errors.work?.[index]?.skills && (
                              <div className="text-red-500">
                                {errors.work[index].skills?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">Компания</label>
                            <FormField
                              {...register(`work[${index}].company`)}
                              placeholder="Выберите компанию"
                            />
                            {errors.work?.[index]?.company && (
                              <div className="text-red-500">
                                {errors.work[index].company?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">
                              Профессия/профессия
                            </label>
                            <FormField
                              {...register(`work[${index}].position`)}
                              placeholder="Выбрать профессию/род деятельности"
                            />
                            {errors.work?.[index]?.position && (
                              <div className="text-red-500">
                                {errors.work[index].position?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">Город</label>
                            <FormSelect {...register(`work[${index}].city`)}>
                              <option value="">Укажите город</option>
                              {formCities.map(city => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </FormSelect>
                            {errors.work?.[index]?.city && (
                              <div className="text-red-500">
                                {errors.work[index].city?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-12">
                            <div className="grid grid-cols-12 gap-3 items-center">
                              <div className="info-item flex flex-col col-span-4">
                                <label htmlFor="startDate">
                                  Start Date (MM/YYYY)
                                </label>
                                <Controller
                                  name={`work[${index}].dateRange.startDate`}
                                  control={control}
                                  render={({ field }) => {
                                    return (
                                      <DatePicker
                                        {...field}
                                        format="MM/yyyy"
                                        style={{ width: 200 }}
                                        placeholder="Select Start Date"
                                        placement="auto"
                                        onChange={date => {
                                          if (date) {
                                            const firebaseTimestamp =
                                              Timestamp.fromDate(
                                                new Date(date)
                                              );
                                            field.onChange(firebaseTimestamp);
                                          } else {
                                            field.onChange(null);
                                          }
                                        }}
                                        value={
                                          field.value instanceof Date
                                            ? field.value
                                            : field.value && field.value.toDate
                                              ? field.value.toDate()
                                              : null
                                        }
                                        cleanable
                                      />
                                    );
                                  }}
                                />

                                {errors.work?.[index]?.dateRange?.startDate && (
                                  <p style={{ color: 'red' }}>
                                    {
                                      errors.work[index].dateRange.startDate
                                        .message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* End Date */}
                              <div className="info-item flex flex-col col-span-4">
                                <label htmlFor="endDate">
                                  End Date (MM/YYYY)
                                </label>
                                <Controller
                                  name={`work[${index}].dateRange.endDate`}
                                  control={control}
                                  render={({ field }) => (
                                    <DatePicker
                                      {...field}
                                      format="MM/yyyy"
                                      style={{ width: 200 }}
                                      placeholder="Select End Date"
                                      placement="auto"
                                      disabled={work.stillWorks}
                                      onChange={date => {
                                        if (date) {
                                          const firebaseTimestamp =
                                            Timestamp.fromDate(new Date(date));
                                          field.onChange(firebaseTimestamp);
                                        } else {
                                          field.onChange(null);
                                        }
                                      }}
                                      value={
                                        field.value instanceof Timestamp
                                          ? field.value.toDate()
                                          : field.value instanceof Date
                                            ? field.value
                                            : null
                                      }
                                      cleanable
                                    />
                                  )}
                                />

                                {errors.work?.[index]?.dateRange?.endDate && (
                                  <p style={{ color: 'red' }}>
                                    {
                                      errors.work[index].dateRange.endDate
                                        .message
                                    }
                                  </p>
                                )}
                              </div>
                              <div className="info-item flex flex-col col-span-4">
                                <label className="font-semibold" htmlFor="">
                                  До настоящего времени
                                </label>
                                <div className="h-10 flex items-center gap-3">
                                  <Controller
                                    name={`work[${index}].stillWorks`}
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="checkbox"
                                        checked={field.value}
                                        onClick={() =>
                                          toggleCheckboxWork(index)
                                        }
                                      />
                                    )}
                                  />
                                  <label htmlFor="">Это продолжается</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="info-item flex flex-col col-span-12">
                            <button
                              type="button"
                              onClick={() =>
                                deleteInfo(
                                  'work',
                                  work.id,
                                  formData,
                                  setFormData
                                )
                              }
                              className="text-red-500"
                            >
                              Удалить
                            </button>
                          </div>
                        </StyledForm>
                      </div>
                    );
                  })
                ) : (
                  <p>no work data found</p>
                )}
              </div>
              <div className="advanced-item w-[635px] text-nowrap">
                <FormDropdown>
                  <div className="flex gap-4">
                    <img className="size-6" src={educationIcon} alt="" />
                    <p>Образование</p>
                  </div>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      addInfo('education', formData, setFormData);
                    }}
                  >
                    +Добавить
                  </p>
                </FormDropdown>
                {formData.education ? (
                  formData.education.map((education, index) => {
                    return (
                      <div key={index} className="advanced-open">
                        <StyledForm>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">
                              Учебное заведение
                            </label>
                            <FormField
                              {...register(`education[${index}].university`)}
                              placeholder="Выберите Учебное заведение"
                            />
                            {errors.education?.[index]?.university && (
                              <div className="text-red-500">
                                {errors.education[index].university?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">
                              Степень образования
                            </label>
                            <FormSelect
                              {...register(`education[${index}].degree`)}
                            >
                              <option value="">Select Education</option>
                              <option value="undergraduate">
                                Undergraduate
                              </option>
                              <option value="bachelor">Bachelor</option>
                              <option value="master">Master</option>
                              <option value="phd">PhD</option>
                            </FormSelect>

                            {errors.education?.[index]?.degree && (
                              <div className="text-red-500">
                                {errors.education[index].degree?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold" htmlFor="">
                              Факультет
                            </label>
                            <FormField
                              {...register(`education[${index}].faculty`)}
                              placeholder="Выбрать профессию/род деятельности"
                            />
                            {errors.education?.[index]?.faculty && (
                              <div className="text-red-500">
                                {errors.education[index].faculty?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">Город</label>
                            <FormSelect
                              {...register(`education[${index}].city`)}
                            >
                              <option value="">Укажите город</option>
                              {formCities.map(city => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </FormSelect>
                            {errors.education?.[index]?.city && (
                              <div className="text-red-500">
                                {errors.education[index].city?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-12">
                            <div className="grid grid-cols-12 gap-3 items-center">
                              <div className="info-item flex flex-col col-span-4">
                                <label htmlFor="startDate">Дата начала</label>
                                <Controller
                                  name={`education[${index}].dateRange.startDate`}
                                  control={control}
                                  render={({ field }) => (
                                    <DatePicker
                                      {...field}
                                      format="MM/yyyy"
                                      style={{ width: 200 }}
                                      placeholder="Select Start Date"
                                      placement="auto"
                                      onChange={date => {
                                        if (date) {
                                          const firebaseTimestamp =
                                            Timestamp.fromDate(new Date(date));
                                          field.onChange(firebaseTimestamp);
                                        } else {
                                          field.onChange(null);
                                        }
                                      }}
                                      value={
                                        field.value && field.value.toDate
                                          ? field.value.toDate()
                                          : field.value instanceof Date
                                            ? field.value
                                            : null
                                      }
                                      cleanable
                                    />
                                  )}
                                />
                                {errors.education?.[index]?.dateRange
                                  ?.startDate && (
                                  <p style={{ color: 'red' }}>
                                    {
                                      errors.education[index].dateRange
                                        .startDate.message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* End Date */}
                              <div className="info-item flex flex-col col-span-4">
                                <label htmlFor="endDate">
                                  Дата восстановления
                                </label>
                                <Controller
                                  name={`education[${index}].dateRange.endDate`}
                                  control={control}
                                  render={({ field }) => (
                                    <DatePicker
                                      {...field}
                                      format="MM/yyyy"
                                      style={{ width: 200 }}
                                      placeholder="Select End Date"
                                      placement="auto"
                                      disabled={education.stillStudy}
                                      onChange={date => {
                                        if (date) {
                                          const firebaseTimestamp =
                                            Timestamp.fromDate(new Date(date));
                                          field.onChange(firebaseTimestamp);
                                        } else {
                                          field.onChange(null);
                                        }
                                      }}
                                      value={
                                        field.value && field.value.toDate
                                          ? field.value.toDate()
                                          : field.value instanceof Date
                                            ? field.value
                                            : null
                                      }
                                      cleanable
                                    />
                                  )}
                                />
                                {errors.education?.[index]?.dateRange
                                  ?.endDate && (
                                  <p style={{ color: 'red' }}>
                                    {
                                      errors.education[index].dateRange.endDate
                                        .message
                                    }
                                  </p>
                                )}
                              </div>
                              <div className="info-item flex flex-col col-span-4">
                                <label className="font-semibold" htmlFor="">
                                  я все еще студент
                                </label>
                                <div className="h-10 flex items-center gap-3">
                                  <Controller
                                    name={`education[${index}].stillStudy`}
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="checkbox"
                                        checked={field.value}
                                        onClick={() => toggleCheckboxEdu(index)}
                                      />
                                    )}
                                  />
                                  <label htmlFor="">Это продолжается</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="info-item flex flex-col col-span-12">
                            <button
                              type="button"
                              onClick={() =>
                                deleteInfo(
                                  'education',
                                  education.id,
                                  formData,
                                  setFormData
                                )
                              }
                              className="text-red-500"
                            >
                              Удалить
                            </button>
                          </div>
                        </StyledForm>
                      </div>
                    );
                  })
                ) : (
                  <p>no education data found</p>
                )}
              </div>
              <div className="advanced-item w-[635px]">
                <FormDropdown>
                  <div className="flex gap-4">
                    <img className="size-6" src={languageIcon} alt="" />
                    <p>Языковые навыки</p>
                  </div>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      addInfo('language', formData, setFormData);
                    }}
                  >
                    +Добавить
                  </p>
                </FormDropdown>
                {formData.language ? (
                  formData.language.map((language, index) => {
                    return (
                      <div key={index} className="advanced-open">
                        <StyledForm>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">Язык</label>
                            <FormSelect
                              {...register(`language[${index}].langChoice`)}
                              placeholder="Выберите навыки/знания"
                            >
                              <option value="">Choose a language</option>
                              {languageChoices &&
                                languageChoices.map((lang, index) => (
                                  <option key={index} value={lang}>
                                    {lang}
                                  </option>
                                ))}
                            </FormSelect>
                            {errors.language?.[index]?.langChoice && (
                              <div className="text-red-500">
                                {errors.language[index].langChoice?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-6">
                            <label className="font-semibold">
                              Уровень владения языком
                            </label>
                            <FormSelect
                              {...register(`language[${index}].langLevel`)}
                              placeholder="Выберите компанию"
                            >
                              <option value="">Choose a language</option>
                              {languageLevels &&
                                languageLevels.map((level, index) => (
                                  <option key={index} value={level}>
                                    {level}
                                  </option>
                                ))}
                            </FormSelect>
                            {errors.language?.[index]?.langLevel && (
                              <div className="text-red-500">
                                {errors.language[index].langLevel?.message}
                              </div>
                            )}
                          </div>
                          <div className="info-item flex flex-col col-span-12">
                            <button
                              type="button"
                              onClick={() =>
                                deleteInfo(
                                  'language',
                                  language.id,
                                  formData,
                                  setFormData
                                )
                              }
                              className="text-red-500"
                            >
                              Удалить
                            </button>
                          </div>
                        </StyledForm>
                      </div>
                    );
                  })
                ) : (
                  <p>no language data found</p>
                )}
              </div>
            </div>
          </div>
          <div className="right w-6/12 my-16">
            <div className="profile-pic bg-[#eeeeee] size-40 rounded-md border border-yellow-400 flex items-center justify-center">
              <img
                className="size-full"
                src={profilePic ? profilePic : profilePhoto}
                alt="Profile"
              />
            </div>

            <div className="file-upload flex flex-col items-center w-1/3">
              <input
                type="text"
                className="h-7 border border-yellow-400 w-40 rounded-md my-3 outline-none px-2"
                {...register('profilePicture')}
                value={urlPath}
                onChange={handleUrlChange}
              />
              {errors.profilePicture && (
                <div className="text-red-500">
                  {errors.profilePicture.message}
                </div>
              )}
              <p
                className="border border-yellow-400 h-7 w-24 rounded-md flex justify-center items-center cursor-pointer"
                onClick={addProfilePic}
              >
                Add Photo
              </p>
            </div>
          </div>
        </div>
        <button type="submit" className="border-2 p-3 my-5">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateResumes;
