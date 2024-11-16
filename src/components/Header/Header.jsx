import React from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import etapLogo from '../../assets/icon/etap-logo.png';
import Navbar from './Navbar';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/authSlice';
import { useEffect } from 'react';

const Header = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className="bg-[#563D7C] px-36 flex flex-col gap-7 py-5">
      <div className="pre-header flex items-center text-white justify-between text-xs">
        <div className="left flex items-center gap-3">
          <img
            className="border-r-2 pr-3 h-6"
            src={etapLogo}
            alt="e-Tap Logo"
          />
          <p>
            Работа{' '}
            <span>
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ color: '#ffffff' }}
              />
            </span>
          </p>
        </div>
        <div className="right flex gap-7 items-center">
          <ul className="flex gap-5">
            <li>Профиль</li>
            <li>
              Сообщения
              <span className="ml-2 border py-1 px-1.5 rounded-full text-[10px]">
                2
              </span>
            </li>
            <li>Уведомления</li>
            <li>Избранное</li>
          </ul>
          <div className="flex gap-5">
            <button
              onClick={handleLogout}
              className="w-32 h-7 border rounded-sm"
            >
              Подписаться
            </button>
            <button className="size-7 border rounded-sm">RU</button>
          </div>
        </div>
      </div>
      {location.pathname != '/' && <Navbar />}
    </div>
  );
};

export default Header;
