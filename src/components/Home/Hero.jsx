import React from 'react';
import heroBg from '../../assets/img/auth-bg.jpeg';
import logo from '../../assets/icon/etap-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Header/Navbar';

const Hero = () => {
  return (
    <div
      className="hero-section h-[440px] bg-cover bg-center relative flex flex-col justify-between px-36 py-16"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="absolute inset-0 bg-[#193570] opacity-50"></div>
      <div className="relative left w-6/12 text-white">
        <img src={logo} alt="eTap logo" />
        <h3 className="text-xl font-bold my-4">
          Будьте в курсе всех вакансий Азербайджана
        </h3>
        <p className="text-sm">
          С новой функцией уведомлений вы будете получть уведомления о новых
          вакасиях на почтовый ящик. Так же вы можете скачать мобильное
          приложение которое позволит вам получать уведомления на телефон.
        </p>
      </div>
      <Navbar />
    </div>
  );
};
export default Hero;
