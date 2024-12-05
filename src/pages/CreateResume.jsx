import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import docIcon from '../assets/icon/doc.png';

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

  useEffect(() => {
    fetchDialCodes();
  }, []);

  return (
    <div className="px-36">
      <p>home/ vakansiya / dizayn</p>
      <div className="resume-area w-12/12">
        <div className="left w-6/12">
          <h1 className="text-[28px] font-bold mt-8">Заполните резюме</h1>
          <div className="resume-details grid grid-cols-12 gap-5 my-8">
            <div className="resume-item flex flex-col gap-3 col-span-6">
              <label htmlFor="">Имя*</label>
              <input
                className="border h-10 px-5"
                type="text"
                placeholder="Джавид"
              />
            </div>
            <div className="resume-item flex flex-col gap-3 col-span-6">
              <label htmlFor="">Фамилия*</label>
              <input
                className="border h-10 px-5"
                type="text"
                placeholder="Гасанов"
              />
            </div>
            <div className="resume-item flex flex-col gap-3 text-nowrap col-span-12">
              <label htmlFor="">Дата рождения*</label>
              <div className="date-select grid grid-cols-12 gap-5">
                <select
                  className="col-span-4 border h-10 px-5"
                  id="day"
                  value={selectedDay}
                  onChange={handleDayChange}
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
            <div className="resume-item flex flex-col gap-3 col-span-6">
              <label htmlFor="">Пол*</label>
              <select name="" id="" className="border h-10 px-5">
                <option value="">Укажите пол</option>
                <option value="">Женщина</option>
                <option value="">Мужчина</option>
              </select>
            </div>
            <div className="resume-item flex flex-col gap-3 col-span-12">
              <label htmlFor="">Город проживания*</label>
              <div className="location grid grid-cols-12 gap-5">
                <select name="" id="" className="col-span-6 h-10 border px-5">
                  <option value="">Укажите город</option>
                  <option value="baku">Baku</option>
                  <option value="sumgayit">Sumqayit</option>
                  <option value="ganja">Ganja</option>
                  <option value="nakchivan">Nakhcivan</option>
                </select>
                <div className="flex text-nowrap items-center gap-3 px-5">
                  <input type="checkbox" name="" id="" className="col-span-6" />
                  <label htmlFor="">Я готов работать за границей</label>
                </div>
              </div>
            </div>
            <div className="resume-item col-span-8 flex flex-col gap-3">
              <label htmlFor="">Контакты*</label>
              <div className="flex border h-10">
                <select
                  name=""
                  id=""
                  className="bg-[#563D7C] text-white w-24 px-5 text-sm"
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
              <label htmlFor="">Почтовый адресс</label>
              <input
                className="border h-10 px-5"
                type="text"
                placeholder="Введите адресс электронной почты"
              />
            </div>
            <div className="resume-item flex flex-col gap-3 col-span-12">
              <label htmlFor="">Какую должность вы хотите занимать*</label>
              <input
                className="border h-10 px-5"
                type="text"
                placeholder="Название должности"
              />
            </div>
            <div className="resume-item flex flex-col gap-3 text-nowrap col-span-4">
              <label htmlFor="">Уровень дохода вы рассматриваете (Руб)*</label>
              <select name="" id="" className="border h-10 px-5">
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
              <select className="border h-10 px-5" name="" id="">
                <option value="<1">Менее 1 года</option>
                <option value="1-3">1-3 года</option>
                <option value="3-5">3-5 года</option>
                <option value=">5">Более 5 лет</option>
              </select>
            </div>
          </div>
          <div className="advanced-areas">
            <div className="advanced-item w-[635px]">
              <div className="advanced-main bg-[#563D7C] text-white flex justify-between h-20 items-center text-nowrap px-7">
                <div className="flex gap-4">
                  <img className="size-6" src={docIcon} alt="" />
                  <p>Опыт работы</p>
                </div>
                <p>+Добавить</p>
              </div>
              <form className="advanced-info border">
                <div className="info-item">
                  <label htmlFor="">Навыки/знания</label>
                  <input type="text" placeholder="Навыки/знания" />
                </div>
                <div className="info-item">
                  <label htmlFor="">Компания</label>
                  <input type="text" placeholder="Выберите компанию" />
                </div>
                <div className="info-item">
                  <label htmlFor="">Профессия/профессия</label>
                  <input
                    type="text"
                    placeholder="Выбрать профессию/род деятельности"
                  />
                </div>
                <div className="info-item">
                  <label htmlFor="">Город</label>
                  <select name="" id="">
                    <option value="baku">Baku</option>
                    <option value="sumgayit">Sumqayit</option>
                    <option value="ganja">Ganja</option>
                    <option value="nakchivan">Nakhcivan</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="right w-6/12"></div>
      </div>
    </div>
  );
};

export default CreateResume;
