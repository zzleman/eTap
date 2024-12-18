import React from 'react';
import noData from '../assets/img/no-data.avif';

const NoData = () => {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <img className="w-1/4" src={noData} alt="no data found" />
      <p className="text-[#563D7C] font-bold text-5xl">No results found!</p>
      <p className="text-xs">
        We couldn't find what you searched for. Try searching again.
      </p>
    </div>
  );
};

export default NoData;
