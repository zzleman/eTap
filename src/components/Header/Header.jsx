import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Button, Placeholder } from 'rsuite';
import MenuIcon from '@mui/icons-material/Menu';
import etapLogo from '../../assets/icon/etap-logo.png';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/authSlice';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isWorker, setIsWorker] = useState(null);

  const currentUser = useSelector(state => state.auth.currentUser);

  if (currentUser && isWorker === null) {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'Users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setIsWorker(userData.isWorker);
        } else {
          toast.error('User data not found!', { position: 'bottom-center' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data!', { position: 'bottom-center' });
      }
    };

    fetchUserData();
  }

  const handleProfileClick = async () => {
    if (currentUser) {
      try {
        const userRef = doc(db, 'Users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          if (userData.isWorker) {
            navigate('/createResumes');
          } else {
            navigate('/companyDetails');
          }
        } else {
          toast.error('User data not found!', { position: 'bottom-center' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data!', { position: 'bottom-center' });
      }
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  const [size, setSize] = useState('calc(100%)');
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="bg-[#563D7C] px-10 lg:px-36 flex flex-col gap-7 py-5">
      <div className="pre-header flex items-center text-white justify-between text-xs">
        <div className="left flex items-center gap-3">
          <Link to="/">
            <img
              className="border-r-2 pr-3 h-6 cursor-pointer"
              src={etapLogo}
              alt="e-Tap Logo"
            />
          </Link>
        </div>
        <div className="right flex gap-7 items-center">
          <ul className="hidden lg:flex gap-5">
            <li>
              <Link
                className="text-white hover:text-neutral-400"
                onClick={handleProfileClick}
              >
                Профиль
              </Link>
            </li>

            {isWorker === false && (
              <Link
                className="text-white hover:text-neutral-400"
                to="/createVacancy"
              >
                Create a Vacancy
              </Link>
            )}

            <Link to="/vacancies" className="text-white hover:text-neutral-400">
              Вакансии
            </Link>
            <Link to="/resumes" className="text-white hover:text-neutral-400">
              Резюме
            </Link>
            <li>Избранное</li>
          </ul>

          <div className="lg:hidden">
            <MenuIcon size="xs" onClick={handleToggle} />
            <Drawer
              size={size}
              placement={placement}
              open={open}
              onClose={handleToggle}
            >
              <Drawer.Header className="flex justify-end">
                <img
                  className="bg-[#563d7c] p-2 rounded-lg"
                  src={etapLogo}
                  alt=""
                />
              </Drawer.Header>
              <Drawer.Body
                className="flex flex-col gap-10 items-center my-5"
                onClick={handleToggle}
              >
                <Link
                  className="text-[#563D7C] hover:text-neutral-400 text-lg"
                  onClick={handleProfileClick}
                >
                  Профиль
                </Link>
                {isWorker === false && (
                  <Link
                    className="text-[#563D7C] hover:text-neutral-400 text-lg"
                    to="/createVacancy"
                  >
                    Create a Vacancy
                  </Link>
                )}
                <Link
                  to="/vacancies"
                  className="text-[#563D7C] hover:text-neutral-400 text-lg"
                >
                  Вакансии
                </Link>
                <Link
                  to="/resumes"
                  className="text-[#563D7C] hover:text-neutral-400 text-lg"
                >
                  Резюме
                </Link>
                <Link className="text-[#563D7C] hover:text-neutral-400 text-lg">
                  Избранное
                </Link>
              </Drawer.Body>
            </Drawer>
          </div>

          <div className="hidden lg:flex gap-5">
            <button
              onClick={handleLogout}
              className="w-32 h-7 border rounded-sm"
            >
              Подписаться
            </button>
            <button className="size-7 border rounded-sm">RU</button>
          </div>
        </div>
      </div>
      {(location.pathname == '/vacancies' ||
        location.pathname == '/resumes') && <Navbar />}
    </div>
  );
};

export default Header;
