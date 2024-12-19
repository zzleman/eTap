import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

const VacancyCategories = () => {
  const [categories, setCategories] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'JobCategories'));
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationToVacancies = () => {
    navigate(`/vacancies/`);
  };

  useEffect(() => {
    getCategories();
  }, []);
  if (loading) {
    <Loading loading={loading} />;
  }
  return (
    <div className="px-10 lg:px-36 flex flex-col gap-7 py-16">
      <div className="flex justify-between">
        <h3 className="font-bold text-xl">Вакансии по сферам</h3>
      </div>
      <ul className="grid md:grid-cols-2 gap-6 list-none mb-10 text-sm">
        {categories &&
          categories.slice(0, 14).map(category => (
            <li
              className="flex items-start gap-3 relative pl-6 cursor-pointer"
              key={category.id}
              onClick={handleNavigationToVacancies}
            >
              <span className="absolute left-0 top-0.5 text-black">•</span>
              {category.name}
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
