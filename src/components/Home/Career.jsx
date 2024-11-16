import React from 'react';
import Card from '../Card/Card';
import card1 from '../../assets/img/card1.png';
import card2 from '../../assets/img/card2.png';
import card3 from '../../assets/img/card3.png';
import card4 from '../../assets/img/card4.png';

const Career = () => {
  return (
    <div className="px-36 flex flex-col my-10">
      <h3 className="mb-10 text-xl font-bold">Всё о карьере и HR</h3>
      <div className="flex justify-between">
        <Card
          bgImg={card1}
          title="Как уйти из офиса на свободу"
          badge1="Офис"
          badge2="Интересное"
          date="9 октября"
        />
        <Card
          bgImg={card2}
          title="Как уйти из офиса на свободу"
          badge1="Офис"
          badge2="Интересное"
          date="9 октября"
        />
        <Card
          bgImg={card3}
          title="Как уйти из офиса на свободу"
          badge1="Офис"
          badge2="Интересное"
          date="9 октября"
        />
        <Card
          bgImg={card4}
          title="Как уйти из офиса на свободу"
          badge1="Офис"
          badge2="Интересное"
          date="9 октября"
        />
      </div>
      <button className="border border-black mx-auto w-44 h-10 text-sm mt-10 rounded-sm">
        Все новости и статьи
      </button>
    </div>
  );
};

export default Career;
