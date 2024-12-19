import React from 'react';

const Card = props => {
  const { title, badge1, badge2, date, bgImg } = props;
  return (
    <div
      className="h-[330px] lg:w-64 bg-no-repeat text-white px-2 lg:px-5 flex flex-col gap-4 justify-end py-12 rounded-sm"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="flex gap-3">
        <div>
          <p className="border w-14 h-6 text-xs flex justify-center items-center rounded-2xl">
            {badge1}
          </p>
        </div>
        <p className="border w-24 h-6 text-xs flex justify-center items-center rounded-2xl">
          {badge2}
        </p>
      </div>
      <p className="text-xs font-thin">{date}</p>
    </div>
  );
};

export default Card;
