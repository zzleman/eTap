import React from 'react';
import appstore from '../../assets/icon/appstore.png';
import playstore from '../../assets/icon/playstore.png';
import bannerImg from '../../assets/img/banner.png';
import rect from '../../assets/img/rect.png';
import facebook from '../../assets/icon/facebook.png';
import instagram from '../../assets/icon/instagram.png';

const Banner = () => {
  return (
    <div className="flex px-36 justify-between gap-6 my-20">
      <div className="left bg-[#6C2AFE] flex h-56 relative w-9/12 text-white">
        <div className="left-text p-10 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Мобильное приложение</h1>
          <p className="text-sm font-extralight">
            Удобный месенджер, качественный поиск, быстрая подача объявлений
          </p>
          <div className="flex gap-3 items-center">
            <img className="h-14" src={appstore} alt="App Store" />
            <img className="h-16" src={playstore} alt="Play Store" />
          </div>
        </div>
        <div className="left-img">
          <img
            className="absolute h-[287px] top-[-39.5px] right-0"
            src={bannerImg}
            alt=""
          />
        </div>
      </div>
      <div className="right w-[265px] h-56 bg-[#F2F5F7]">
        <div
          className="right-top h-[74px] flex flex-col py-1 items-center"
          style={{
            backgroundImage: `url(${rect})`,
          }}
        >
          <h2 className="text-[22px] font-bold">Мы в соцсетях</h2>
          <p className="text-sm">Группы и сообщества</p>
        </div>
        <div className="flex flex-col items-center py-5 gap-4">
          <div className="fb bg-[#3C5A9A] w-56 h-11 flex px-5 text-white gap-3 items-center rounded">
            <img className="h-5" src={facebook} alt="" />
            <p className="text-sm">Фейсбук</p>
          </div>
          <div className="fb bg-[#D62B87] w-56 h-11 flex px-5 text-white gap-3 items-center rounded">
            <img className="h-5" src={instagram} alt="" />
            <p className="text-sm">Инстаграмм</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
