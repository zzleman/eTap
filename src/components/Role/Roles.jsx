import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Roles = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.currentUser);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isWorker) {
        navigate('/createResumes');
      } else {
        navigate('/createVacancy');
      }
    }
  }, [currentUser, navigate]);
};

export default Roles;
