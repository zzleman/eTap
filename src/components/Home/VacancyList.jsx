import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const VacancyList = () => {
  const [vacancies, setVacancies] = useState([]);

  const getTimeAgo = timestamp => {
    if (!timestamp) {
      return 'Unknown time';
    }

    const createdAt = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const days = Math.floor(diffInSeconds / 86400);

    if (days > 0) {
      return `${days} д назад`;
    } else if (hours > 0) {
      return `${hours} ч назад`;
    } else if (minutes > 0) {
      return `${minutes} мин назад`;
    } else {
      return `Только что`;
    }
  };

  const getVacancies = async () => {
    const querySnapshot = await getDocs(collection(db, 'vacancies'));
    const vacanciesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVacancies(vacanciesData);
  };

  useEffect(() => {
    getVacancies();
  }, []);
  return (
    <div className="flex flex-col gap-7">
      <div className="top flex justify-between px-5 items-center lg:px-36">
        <h3 className="font-bold text-xl">Вакансии дня в Азербайджане</h3>
        <p className="text-xs">{vacancies.length} актуальные вакансии</p>
      </div>
      <div className="bottom grid md:grid-cols-2 lg:grid-cols-3 px-5 lg:px-32">
        {vacancies &&
          vacancies.slice(0, 6).map(vacancy => (
            <div
              key={vacancy.id}
              className="item flex flex-col gap-4 p-5 border"
            >
              <h5 className="font-bold">{vacancy.title}</h5>
              <p className="w-[104px] h-10 bg-[#FFEBA8] font-bold text-sm flex items-center justify-center rounded-sm">
                {vacancy.salary} AZN
              </p>
              <div className="flex items-center text-xs gap-4 text-neutral-400">
                <p className="text-black font-bold">{vacancy.companyName}</p>
                <div>
                  <p>{vacancy.location}</p>
                </div>
                <p>{getTimeAgo(vacancy.createdAt)}</p>
              </div>
            </div>
          ))}
      </div>
      <button className="border border-black w-36 h-10 mx-auto text-sm mt-5">
        Смотреть все
      </button>
    </div>
  );
};

export default VacancyList;
