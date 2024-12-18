import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VacancyListSingle from '../components/Vacancy/VacancyListSingle';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading/Loading';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  const getQueryParams = queryName => {
    const params = new URLSearchParams(search);
    return params.get(queryName);
  };

  const categoryId = getQueryParams('category');
  const cityName = getQueryParams('city');
  const salaryQuantity = getQueryParams('salary');
  const experienceTotal = getQueryParams('experience');
  const jobType = getQueryParams('jobType');

  const getVacancies = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'vacancies'));
      const allVacancies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredVacancies = allVacancies;

      if (categoryId) {
        filteredVacancies = filteredVacancies.filter(
          vacancy =>
            vacancy.category &&
            vacancy.category.toLowerCase() === categoryId.toLowerCase()
        );
      }
      if (cityName) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.location.toLowerCase() === cityName.toLowerCase()
        );
      }
      if (salaryQuantity) {
        const [minSalary, maxSalary] = salaryQuantity.split('-').map(Number);
        filteredVacancies = filteredVacancies.filter(vacancy => {
          const salary = parseFloat(vacancy.salary);
          return (
            salary >= minSalary &&
            (maxSalary === 5000 ? salary >= minSalary : salary <= maxSalary)
          );
        });
      }
      if (experienceTotal) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.experience === experienceTotal
        );
      }

      if (jobType) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.jobType === jobType
        );
      }

      setVacancies(filteredVacancies);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVacancies();
  }, [search]);

  if (loading) {
    return <Loading loading={loading} />;
  }
  return (
    <div className="px-36 py-5">
      <h1 className="text-2xl font-bold py-5">Вакансии по фильтрам</h1>
      <div className="vacancies-container">
        {vacancies.length > 0 ? (
          vacancies.map(vacancy => (
            <VacancyListSingle
              categoryId={categoryId}
              {...vacancy}
              key={vacancy.id}
            />
          ))
        ) : (
          <p>Нет вакансий для выбранных фильтров.</p>
        )}
      </div>
    </div>
  );
};

export default Vacancies;
