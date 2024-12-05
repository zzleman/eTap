import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VacancyListSingle from '../components/Vacancy/VacancyListSingle';
import { useLocation } from 'react-router-dom';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  const { search } = useLocation(); // Get query parameters from the URL

  // Helper function to extract query parameters
  const getQueryParams = queryName => {
    const params = new URLSearchParams(search);
    return params.get(queryName);
  };

  const categoryId = getQueryParams('category');
  const cityName = getQueryParams('city');
  const salaryQuantity = getQueryParams('salary');
  const experienceTotal = getQueryParams('experience');
  const jobType = getQueryParams('jobType');

  // Fetch vacancies from Firestore and apply filters based on query parameters
  const getVacancies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vacancies'));
      const allVacancies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredVacancies = allVacancies;

      // Filter by category
      if (categoryId) {
        filteredVacancies = filteredVacancies.filter(
          vacancy =>
            vacancy.category &&
            vacancy.category.toLowerCase() === categoryId.toLowerCase()
        );
      }

      // Filter by city
      if (cityName) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.location.toLowerCase() === cityName.toLowerCase()
        );
      }

      // Filter by salary range
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

      // Filter by experience
      if (experienceTotal) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.experience === experienceTotal
        );
      }

      // Filter by job type
      if (jobType) {
        filteredVacancies = filteredVacancies.filter(
          vacancy => vacancy.jobType === jobType
        );
      }

      setVacancies(filteredVacancies);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    }
  };

  // Fetch vacancies whenever query parameters change
  useEffect(() => {
    getVacancies();
  }, [search]); // Use `search` because query parameters might change

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
