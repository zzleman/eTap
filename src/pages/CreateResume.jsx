import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import docIcon from '../assets/icon/doc.png';
import educationIcon from '../assets/icon/education.png';
import languageIcon from '../assets/icon/language.png';
import portfolioIcon from '../assets/icon/portfolio.png';
import userImage from '../assets/img/user.png';
import { toast } from 'react-toastify';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { Field, useFormik } from 'formik';
import { CreateResumeSchema } from '../schemas/CreateResumeSchema';

const CreateResume = () => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 18;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
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

  const years = Array.from({ length: minYear - 1940 + 1 }, (_, i) => 1940 + i);

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dialCode, setDialCode] = useState([]);
  const [work, setWork] = useState([]);
  const [education, setEducation] = useState([]);
  const [language, setLanguage] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [userImage, setUserImage] = useState([]);

  const handleDayChange = e => setSelectedDay(e.target.value);
  const handleMonthChange = e => setSelectedMonth(e.target.value);
  const handleYearChange = e => setSelectedYear(e.target.value);

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

  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioImages(prevImages => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserImgUpload = async event => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'qwo4m5vr');
      formData.append('cloud_name', 'dikulg0xw');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dikulg0xw/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setUserImage(data.secure_url);
        console.log('Uploaded Image URL:', data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const removeImage = index => {
    setPortfolioImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const addWorkInfo = () => {
    if (work.length < 3) {
      setWork([
        ...work,
        {
          id: Date.now(),
          skills: '',
          company: '',
          profession: '',
          city: '',
          startDate: '',
          endDate: '',
          ongoing: false,
          achievements: '',
        },
      ]);
    }
  };
  const addEduInfo = () => {
    if (education.length < 3) {
      setEducation([
        ...education,
        {
          id: Date.now(),
          eduCenter: '',
          eduLevel: '',
          department: '',
          city: '',
          startDate: '',
          endDate: '',
          ongoing: false,
        },
      ]);
    }
  };
  const addLanguageİnfo = () => {
    if (language.length < 3) {
      setLanguage([
        ...language,
        {
          id: Date.now(),
          lang: '',
          langLevel: '',
        },
      ]);
    }
  };

  const deleteWorkForm = id => {
    setWork(work.filter(form => form.id !== id));
  };
  const deleteEduForm = id => {
    setEducation(education.filter(form => form.id !== id));
  };
  const deleteLangForm = id => {
    setLanguage(language.filter(form => form.id !== id));
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      birthDate: {
        day: '',
        month: '',
        year: '',
      },
      gender: '',
      city: '',
      willingToRelocate: false,
      contactNumber: '',
      email: '',
      desiredPosition: '',
      salaryRange: '',
      experience: '',
      workHistory: [
        {
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          ongoing: false,
        },
      ],
      education: [
        {
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
          ongoing: false,
        },
      ],
    },
    validationSchema: CreateResumeSchema,
    onSubmit: async (values, actions) => {
      try {
        // Structure the data for Firestore insertion
        const docRef = await addDoc(collection(db, 'resumes'), {
          firstName: values.firstName,
          lastName: values.lastName,
          birthDate: {
            day: values.birthDate.day,
            month: values.birthDate.month,
            year: values.birthDate.year,
          },
          gender: values.gender,
          city: values.city,
          willingToRelocate: values.willingToRelocate,
          contactNumber: values.contactNumber,
          email: values.email,
          desiredPosition: values.desiredPosition,
          salaryRange: values.salaryRange,
          experience: values.experience,
          workHistory: values.workHistory.map(work => ({
            ...work,
            ongoing: work.ongoing, // Include ongoing field here
          })),
          education: values.education.map(edu => ({
            ...edu,
            ongoing: edu.ongoing, // Include ongoing field here
          })),
          createdAt: serverTimestamp(),
        });

        // Show success notification
        toast.success('Vacancy created successfully!', {
          position: 'top-center',
        });

        // Reset form after successful submission
        actions.resetForm();
      } catch (error) {
        // Handle errors by showing error message in the toast
        toast.error(error.message || 'Something went wrong!', {
          position: 'bottom-center',
        });
      }
    },
  });

  useEffect(() => {
    fetchDialCodes();
  }, []);

  return (
    <div className="px-36">
      <p>home/ vakansiya / dizayn</p>
      <form className="resume-area mb-8" onClick={handleSubmit}>
        <div className=" w-12/12 flex gap-24">
          <div className="left w-6/12">
            <h1 className="text-[28px] font-bold mt-8">Заполните резюме</h1>
            <div className="resume-details grid grid-cols-12 gap-5 my-8">
              <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold" htmlFor="">
                  Имя*
                </label>
                <input
                  className="border h-10 px-5"
                  placeholder="Джавид"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold" htmlFor="">
                  Фамилия*
                </label>
                <input
                  className="border h-10 px-5"
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Гасанов"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-12">
                <label className="font-semibold" htmlFor="">
                  Дата рождения*
                </label>
                <div className="date-select grid grid-cols-12 gap-5">
                  <select
                    className="col-span-4 border h-10 px-5"
                    id="day"
                    value={selectedDay}
                    onChange={handleDayChange}
                    onBlur={handleBlur}
                  >
                    <option value="">День</option>
                    {days.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <select
                    className="col-span-4 border h-10 px-5"
                    id="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Месяц</option>
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="col-span-4 border h-10 px-5"
                    id="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Год</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Field name="gender" component="select">
                <option value="">Укажите пол</option>
                <option value="female">Женщина</option>
                <option value="male">Мужчина</option>
              </Field>
              {/* <div className="resume-item flex flex-col gap-3 col-span-6">
                <label className="font-semibold" htmlFor="">
                  Пол*
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="border h-10 px-5"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Укажите пол</option>
                  <option value="">Женщина</option>
                  <option value="">Мужчина</option>
                </select>
              </div> */}
              <div className="resume-item flex flex-col gap-3 col-span-12">
                <label className="font-semibold" htmlFor="">
                  Город проживания*
                </label>
                <div className="location grid grid-cols-12 gap-5">
                  <select
                    name="city"
                    id="city"
                    className="col-span-6 h-10 border px-5"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Укажите город</option>
                    <option value="baku">Baku</option>
                    <option value="sumgayit">Sumqayit</option>
                    <option value="ganja">Ganja</option>
                    <option value="nakchivan">Nakhcivan</option>
                  </select>
                  <div className="flex text-nowrap items-center gap-3 px-5">
                    <input
                      type="checkbox"
                      name="willingToRelocate"
                      id="willingToRelocate"
                      className="col-span-6"
                      value={values.willingToRelocate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label className="font-semibold" htmlFor="">
                      Я готов работать за границей
                    </label>
                  </div>
                </div>
              </div>
              <div className="resume-item col-span-8 flex flex-col gap-3">
                <label className="font-semibold" htmlFor="">
                  Контакты*
                </label>
                <div className="flex border h-10">
                  <select
                    name="contactNumber"
                    id="contactNumber"
                    className="bg-[#563D7C] text-white w-24 px-5 text-sm"
                    value={values.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {dialCode &&
                      dialCode
                        .sort((a, b) => a.localeCompare(b))
                        .map(code => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                  </select>
                  <input
                    className="px-7"
                    type="text"
                    placeholder="Укажите номер телефона"
                  />
                </div>
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-8">
                <label className="font-semibold" htmlFor="">
                  Почтовый адресс
                </label>
                <input
                  className="border h-10 px-5"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Введите адресс электронной почты"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-12">
                <label className="font-semibold" htmlFor="">
                  Какую должность вы хотите занимать*
                </label>
                <input
                  className="border h-10 px-5"
                  type="text"
                  id="desiredPosition"
                  name="desiredPosition"
                  placeholder="Название должности"
                  value={values.desiredPosition}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-4">
                <label htmlFor="">
                  Уровень дохода вы рассматриваете (Руб)*
                </label>
                <select
                  name="salaryRange"
                  id="salaryRange"
                  className="border h-10 px-5"
                  value={values.salaryRange}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">З/п</option>
                  <option value="0-500">0-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000-2000">1000-2000</option>
                  <option value="2000-5000">2000-5000</option>
                  <option value="5000+">5000+</option>
                </select>
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-9">
                <label htmlFor="">Опыт</label>
                <select
                  className="border h-10 px-5"
                  name="experience"
                  id="experience"
                  value={values.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="<1">Менее 1 года</option>
                  <option value="1-3">1-3 года</option>
                  <option value="3-5">3-5 года</option>
                  <option value=">5">Более 5 лет</option>
                </select>
              </div>
            </div>
            <div className="advanced-areas flex flex-col gap-5">
              <div className="advanced-item w-[635px]">
                <div className="advanced-main bg-[#563D7C] text-white flex justify-between h-20 items-center text-nowrap px-7">
                  <div className="flex gap-4">
                    <img className="size-6" src={docIcon} alt="" />
                    <p>Опыт работы</p>
                  </div>
                  <p className="cursor-pointer" onClick={addWorkInfo}>
                    +Добавить
                  </p>
                </div>

                {work.map(form => (
                  <form className="advanced-info border grid grid-cols-12 gap-3 px-5 text-sm py-5">
                    <div className="info-item flex flex-col col-span-12">
                      <label className="font-semibold" htmlFor="">
                        Навыки/знания
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выберите навыки/знания"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Компания
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выберите компанию"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Профессия/профессия
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выбрать профессию/род деятельности"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-9">
                      <label className="font-semibold" htmlFor="">
                        Город
                      </label>
                      <select
                        name=""
                        id=""
                        className="border h-10 px-5 outline-none"
                      >
                        <option value="baku">Baku</option>
                        <option value="sumgayit">Sumqayit</option>
                        <option value="ganja">Ganja</option>
                        <option value="nakchivan">Nakhcivan</option>
                      </select>
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        Дата начала
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="mm/yyyy"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        Дата восстановления
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="mm/yyyy"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        До настоящего времени
                      </label>
                      <div className="h-10 flex items-center gap-3">
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Это продолжается</label>
                      </div>
                    </div>
                    <div className="info-item flex flex-col col-span-12">
                      <label className="font-semibold" htmlFor="">
                        Достижения/достижения
                      </label>
                      <textarea
                        placeholder="Напишите о своих обязанностях, проделанной работе, результатах."
                        name=""
                        id=""
                        className="min-h-24 border px-5"
                      ></textarea>
                    </div>
                    <div className="info-item flex flex-col col-span-12">
                      <button
                        type="button"
                        onClick={() => deleteWorkForm(form.id)}
                        className="text-red-500"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>
              <div className="advanced-item w-[635px]">
                <div className="advanced-main bg-[#563D7C] text-white flex justify-between h-20 items-center text-nowrap px-7">
                  <div className="flex gap-4">
                    <img className="size-6" src={educationIcon} alt="" />
                    <p>Образование</p>
                  </div>
                  <p className="cursor-pointer" onClick={addEduInfo}>
                    +Добавить
                  </p>
                </div>

                {education.map(form => (
                  <form className="advanced-info border grid grid-cols-12 gap-3 px-5 text-sm py-5">
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Учебное заведение
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выберите навыки/знания"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Степень образования
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выберите компанию"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Факультет
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="Выбрать профессию/род деятельности"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Город
                      </label>
                      <select
                        name=""
                        id=""
                        className="border h-10 px-5 outline-none"
                      >
                        <option value="baku">Baku</option>
                        <option value="sumgayit">Sumqayit</option>
                        <option value="ganja">Ganja</option>
                        <option value="nakchivan">Nakhcivan</option>
                      </select>
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        Дата начала
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="mm/yyyy"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        Дата восстановления
                      </label>
                      <input
                        className="border h-10 px-5 outline-none"
                        type="text"
                        placeholder="mm/yyyy"
                      />
                    </div>
                    <div className="info-item flex flex-col col-span-4">
                      <label className="font-semibold" htmlFor="">
                        До настоящего времени
                      </label>
                      <div className="h-10 flex items-center gap-3">
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">я все еще студент</label>
                      </div>
                    </div>

                    <div className="info-item flex flex-col col-span-12">
                      <button
                        type="button"
                        onClick={() => deleteEduForm(form.id)}
                        className="text-red-500"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>
              <div className="advanced-item w-[635px]">
                <div className="advanced-main bg-[#563D7C] text-white flex justify-between h-20 items-center text-nowrap px-7">
                  <div className="flex gap-4">
                    <img className="size-6" src={languageIcon} alt="" />
                    <p>Языковые навыки</p>
                  </div>
                  <p className="cursor-pointer" onClick={addLanguageİnfo}>
                    +Добавить
                  </p>
                </div>

                {language.map(form => (
                  <form className="advanced-info border grid grid-cols-12 gap-3 px-5 text-sm py-5">
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Язык
                      </label>
                      <select
                        name=""
                        id=""
                        className="border h-10 px-5 outline-none"
                      >
                        <option value="">Азербайджан</option>
                        <option value="">Английский</option>
                        <option value="">Русский</option>
                        <option value="">Французский</option>
                        <option value="">Tурецкий</option>
                      </select>
                    </div>
                    <div className="info-item flex flex-col col-span-6">
                      <label className="font-semibold" htmlFor="">
                        Уровень владения языком
                      </label>
                      <select
                        name=""
                        id=""
                        className="border h-10 px-5 outline-none"
                      >
                        <option value="">А1 - Начало</option>
                        <option value="">А2 – Слабый</option>
                        <option value="">B1- Средний</option>
                        <option value="">B2- Выше среднего</option>
                        <option value="">C1 — Высокий</option>
                        <option value="">C2 – Идеально</option>
                      </select>
                    </div>

                    <div className="info-item flex flex-col col-span-12">
                      <button
                        type="button"
                        onClick={() => deleteLangForm(form.id)}
                        className="text-red-500"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>
              <div className="advanced-item w-[635px]">
                <div className="advanced-main bg-[#563D7C] text-white flex justify-between h-20 items-center px-7">
                  <div className="flex gap-4">
                    <img
                      className="w-6 h-6"
                      src={portfolioIcon}
                      alt="Portfolio Icon"
                    />
                    <p>Портфолио</p>
                  </div>
                  <p
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById('image-upload').click()
                    }
                  >
                    +Добавить
                  </p>
                </div>

                {portfolioImages.length > 0 && (
                  <div className="portfolio-images grid grid-cols-3 gap-3 px-5 py-5">
                    {portfolioImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Portfolio ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white px-1.5"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className="right w-6/12 my-12">
            <div className="outer-image bg-[#EEEEEE] size-40 rounded-md flex items-center justify-center border border-yellow-400 relative">
              {userImage ? (
                <>
                  <img
                    src={userImage}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => setUserImage(null)}
                    className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 text-sm"
                  >
                    X
                  </button>
                </>
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>
            <p
              className="text-sm py-2"
              onClick={() => document.getElementById('user-upload').click()}
            >
              {userImage ? 'Изменить фотографию' : 'Добавить фотографию'}
            </p>
            <input
              id="user-upload"
              type="file"
              onChange={handleUserImgUpload}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-center text-sm my-10">
          <button className="border border-[#563D7C] h-8 w-24">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResume;
