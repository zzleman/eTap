import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggleNav = () => {
    setOpen(!open);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex gap-7 items-center text-white text-sm">
        <select name="" id="" className="w-[350px] h-10 text-neutral-400 px-5">
          <option value="">Сфера деятельности</option>
          <option value="">salam</option>
        </select>
        <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
          <option value="">Город</option>
        </select>
        <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
          <option value="">Зарплата</option>
        </select>
        <div className="relative">
          <FontAwesomeIcon
            className="text-white absolute top-2.5 px-5"
            icon={faMagnifyingGlass}
          />
          <input
            className="w-40 h-10 bg-transparent border px-11 text-white"
            type="text"
            placeholder="Найти"
          />
        </div>
        <div>
          <button onClick={toggleNav}>
            Расширенный поиск
            <span className="mx-2">
              <FontAwesomeIcon
                className="text-white text-sm"
                icon={faChevronDown}
              />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="hidden-nav relative gap-7 text-sm flex">
          <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
            <option value="">Город</option>
          </select>
          <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
            <option value="">Город</option>
          </select>
          <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
            <option value="">Город</option>
          </select>
          <select name="" id="" className="w-40 h-10 text-neutral-400 px-5">
            <option value="">Город</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Navbar;
