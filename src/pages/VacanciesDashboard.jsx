import React, { useEffect, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import { Sidenav, Nav } from 'rsuite';
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
import { Link, useNavigate } from 'react-router-dom';

const VacanciesDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.uid;
  const [vacancies, setVacancies] = useState([]);

  const fetchCompanyVacancies = async () => {
    if (!userId) {
      console.log('No user ID found.');
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

  const navigateSidenav = path => {
    navigate(path);
  };

  useEffect(() => {
    fetchCompanyVacancies();
  }, [userId]);

  return (
    <div className="mx-36 flex items-center gap-10">
      <div className="w-3/12">
        <Sidenav defaultOpenKeys={['3', '4']}>
          <Sidenav.Body>
            <Nav activeKey="1">
              <Nav.Item
                eventKey="1"
                icon={<DashboardIcon />}
                onClick={() => navigateSidenav('/dashboard')}
              >
                Dashboard
              </Nav.Item>
              <Nav.Item
                eventKey="2"
                icon={<GroupIcon />}
                onClick={() => navigateSidenav('/companyDetails')}
              >
                Company
              </Nav.Item>
              <Nav.Item
                eventKey="3"
                icon={<MagicIcon />}
                onClick={() => navigateSidenav('/createVacancy')}
              >
                Create Vacancy
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
      <div className="w-8/12">
        {vacancies.length > 0 ? (
          vacancies.map(vacancy => (
            <div
              key={vacancy.id}
              className="flex my-10 border-2 rounded-xl p-5 justify-between"
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
    </div>
  );
};

export default VacanciesDashboard;
