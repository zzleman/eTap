import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';

const VacancyCategories = () => {
  const [categories, setCategories] = useState();
  const getCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'JobCategories'));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCategories(categories);
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="px-36 flex flex-col gap-7 py-16">
      <div className="flex justify-between">
        <h3 className="font-bold text-xl">Вакансии по сферам</h3>
        <p className="text-xs">
          45 874 561 актуальные вакансии
          <span className="px-4 text-[#4334A6]">+ 22 сегодня</span>
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-6 list-none mb-10 text-sm">
        {categories &&
          categories.map(category => (
            <li
              className="flex items-start gap-3 relative pl-6"
              key={category.id}
            >
              <span className="absolute left-0 top-0.5 text-black">•</span>
              {category.name}
              <p className="text-neutral-400">
                4725 <span className="text-[#4334A6] pl-2">+6</span>
              </p>
            </li>
          ))}
      </ul>
      <button className="border border-black w-36 h-10 mx-auto text-sm">
        Смотреть все
      </button>
    </div>
  );
};

export default VacancyCategories;
