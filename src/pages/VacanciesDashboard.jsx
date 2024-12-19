import React, { useEffect, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import NoData from './NoData';

const VacanciesDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const [vacancies, setVacancies] = useState([]);

  const fetchCompanyVacancies = async () => {
    if (!userId) {
      return;
    }
    try {
      const vacanciesRef = collection(db, 'vacancies');
      const filteredVacancies = query(
        vacanciesRef,
        where('companyId', '==', userId)
      );
      const vacanciesSnapshot = await getDocs(filteredVacancies);

      const vacanciesData = [];
      vacanciesSnapshot.forEach(doc => {
        vacanciesData.push({ id: doc.id, ...doc.data() });
      });

      setVacancies(vacanciesData);
    } catch (error) {
      console.error('Error fetching vacancies of this company:', error);
    }
  };

  const deleteVacancy = async vacancyId => {
    try {
      const vacancyRef = doc(db, 'vacancies', vacancyId);
      await deleteDoc(vacancyRef);

      setVacancies(prevVacancies =>
        prevVacancies.filter(vacancy => vacancy.id !== vacancyId)
      );
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  useEffect(() => {
    fetchCompanyVacancies();
  }, [userId]);

  return (
    <div>
      {vacancies.length > 0 ? (
        vacancies.map(vacancy => (
          <div
            key={vacancy.id}
            className="flex mx-36 my-10 border-2 rounded-xl p-5 justify-between w-8/12"
          >
            <div className="flex gap-7">
              <div className="left">
                <img
                  className="size-20"
                  src={vacancy.companyImg}
                  alt="Company"
                />
              </div>
              <div className="middle flex flex-col gap-2">
                <p>{vacancy.companyName || 'Company Name'}</p>
                <h5>{vacancy.title || 'Job Title'}</h5>
                <p>
                  {vacancy.location || 'Location'} •{' '}
                  {vacancy.jobType || 'Job Type'}
                </p>
              </div>
            </div>
            <div className="right flex gap-2">
              {/* <EditOutlinedIcon style={{ fontSize: 'large' }} /> */}
              <DeleteOutlineOutlinedIcon
                style={{ fontSize: 'large', color: 'red' }}
                onClick={() => deleteVacancy(vacancy.id)}
              />
            </div>
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default VacanciesDashboard;
