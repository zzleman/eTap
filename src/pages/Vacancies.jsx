import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VacancyListSingle from '../components/Vacancy/VacancyListSingle';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import NoData from './NoData';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  const getQueryParams = queryName => {
    const params = new URLSearchParams(search);
    return params.get(queryName);
  };
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const categoryId = getQueryParams('category');
  const cityName = getQueryParams('city');
  const salaryQuantity = getQueryParams('salary');
  const experienceTotal = getQueryParams('experience');
  const jobType = getQueryParams('jobType');
  const searchQuery = getQueryParams('query');
  const [userFavorites, setUserFavorites] = useState([]);

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
          vacancy =>
            vacancy.location &&
            vacancy.location.toLowerCase() === cityName.toLowerCase()
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

      if (searchQuery) {
        filteredVacancies = filteredVacancies.filter(vacancy => {
          return vacancy.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });
      }

      setVacancies(filteredVacancies);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (vacancyId, isFavorite) => {
    if (!user) {
      console.log('User must be logged in to add to favorites.');
      return;
    }

    try {
      const userDocRef = doc(db, 'Users', userId);

      if (isFavorite) {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(vacancyId),
        });
        setUserFavorites(prev => [...prev, vacancyId]);
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(vacancyId),
        });
        setUserFavorites(prev => prev.filter(id => id !== vacancyId));
      }
    } catch (error) {
      console.error('Error updating favorites in Firestore:', error);
    }
  };

  useEffect(() => {
    getVacancies();
  }, [search]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="px-5 lg:px-36 py-5">
      <h1 className="text-2xl font-bold py-5">Вакансии по фильтрам</h1>
      <div className="vacancies-container">
        {vacancies.length > 0 ? (
          vacancies.map(vacancy => (
            <VacancyListSingle
              key={vacancy.id}
              {...vacancy}
              userFavorites={userFavorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default Vacancies;
