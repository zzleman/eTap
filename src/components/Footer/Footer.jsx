import React from 'react';
import etapLogo from '../../assets/icon/etap-logo.png';

const Footer = () => {
  return (
    <div className="text-white">
      <div className="top grid grid-cols-2 md:grid-cols-4 justify-between bg-[#6D5297] p-10 lg:px-36 lg:h-60 lg:items-center text-sm py-10 lg:py-0 gap-5 lg:gap-0">
        <div>
          <img className="h-8" src={etapLogo} alt="" />
          <p className="my-2">Слоган будет размещен здесь!</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Меню</h4>
          <ul className="flex flex-col gap-4">
            <li>Обратная связь</li>
            <li>Мои заказы</li>
            <li>Настройки</li>
            <li>О сервисе</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Контакты</h4>
          <ul className="flex flex-col gap-4">
            <li>Обратная связь</li>
            <li>Мои заказы</li>
            <li>Настройки</li>
            <li>О сервисе</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">О нас</h4>
          <ul className="flex flex-col gap-4">
            <li>Обратная связь</li>
            <li>Мои заказы</li>
            <li>Настройки</li>
            <li>О сервисе</li>
          </ul>
        </div>
      </div>
      <div className="bottom bg-[#563D7C] h-6 text-xs flex items-center justify-center">
        <p>Все права защищены. 2019</p>
      </div>
    </div>
  );
};

export default Footer;
