import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormDropdown,
  FormField,
  FormSelect,
} from '../components/Styled/Styled';
import docIcon from '../assets/icon/doc.png';
import educationIcon from '../assets/icon/education.png';
import languageIcon from '../assets/icon/language.png';
import portfolioIcon from '../assets/icon/portfolio.png';
import { formCities, schema } from '../schemas/CreateResumeSchema';
import { days, months, years } from '../schemas/CreateResumeSchema';
import { useEffect } from 'react';
import axios from 'axios';

const CreateResumes = () => {
  const [dialCode, setDialCode] = useState([]);
  const uniqueDialCodes = [...new Set(dialCode)];

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async data => {
    console.log('Form data:', data);
  };

  useEffect(() => {
    fetchDialCodes();
  }, []);
  return (
    <div className="px-36">
      <p>home/ vakansiya / dizayn</p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

                  <FormSelect {...register('birthDay.month')}>
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
                  <FormSelect {...register('city')}>
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
                    <input
                      type="checkbox"
                      id="willingToRelocate"
                      {...register('willingToRelocate')}
                    />
                    <label
                      className="font-semibold"
                      htmlFor="willingToRelocate"
                    >
                      Я готов работать за границей
                    </label>
                    {errors.willingToRelocate && (
                      <div className="text-red-500">
                        {errors.willingToRelocate.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="resume-item col-span-8 flex flex-col gap-3">
                <label className="font-semibold" htmlFor="">
                  Контакты*
                </label>
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
                <label className="font-semibold" htmlFor="">
                  Почтовый адресс
                </label>
                <FormField
                  placeholder="Введите адресс электронной почты"
                  {...register('email')}
                ></FormField>
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 col-span-12">
                <label className="font-semibold" htmlFor="">
                  Какую должность вы хотите занимать*
                </label>
                <FormField
                  placeholder="Название должности"
                  {...register('position')}
                ></FormField>
                {errors.position && (
                  <div className="text-red-500">{errors.position.message}</div>
                )}
              </div>
              <div className="resume-item flex flex-col gap-3 text-nowrap col-span-4">
                <label htmlFor="">
                  Уровень дохода вы рассматриваете (Руб)*
                </label>
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
                  <option value="">Choose an experience</option>
                  <option value="<1">Менее 1 года</option>
                  <option value="1-3">1-3 года</option>
                  <option value="3-5">3-5 года</option>
                  <option value=">5">Более 5 лет</option>
                </FormSelect>
                {errors.experience && (
                  <div className="text-red-500">
                    {errors.experience.message}
                  </div>
                )}
              </div>
            </div>
            <div className="advanced-areas flex flex-col gap-5">
              <div className="advanced-item w-[635px] text-nowrap">
                <FormDropdown>
                  <div className="flex gap-4">
                    <img className="size-6" src={docIcon} alt="" />
                    <p>Опыт работы</p>
                  </div>
                  <p className="cursor-pointer">+Добавить</p>
                </FormDropdown>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="border-2 p-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateResumes;
