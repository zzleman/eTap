import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  RadioGroup,
  Radio,
  ButtonToolbar,
  Button,
  IconButton,
  Placeholder,
} from 'rsuite';
import MenuIcon from '@mui/icons-material/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import etapLogo from '../../assets/icon/etap-logo.png';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/authSlice';
import { useEffect } from 'react';
import { Dropdown } from 'rsuite';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [size, setSize] = useState('calc(100%)');
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');

  const handleToggle = value => {
    setOpen(!open);
  };

  const currentUser = useSelector(state => state.auth.currentUser);

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

  return (
    <div className="bg-[#563D7C] px-10 lg:px-36 flex flex-col gap-7 py-5">
      <div className="pre-header  flex items-center text-white justify-between text-xs">
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
            <Link to="/vacancies" className="text-white hover:text-neutral-400">
              Вакансии
            </Link>
            <Link to="/resumes" className="text-white hover:text-neutral-400">
              Резюме
            </Link>
            <li>Избранное</li>
          </ul>
          <div className="lg:hidden bg-red-600 ">
            <MenuIcon size="xs" onClick={handleToggle} />
            <Drawer
              size={size}
              placement={placement}
              open={open}
              onClose={handleToggle}
            >
              <Drawer.Header>
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.Actions>
                  <Button onClick={handleToggle}>Cancel</Button>
                  <Button onClick={handleToggle} appearance="primary">
                    Confirm
                  </Button>
                </Drawer.Actions>
              </Drawer.Header>
              <Drawer.Body>
                <Placeholder.Paragraph rows={8} />
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
      {location.pathname != '/' && <Navbar />}
    </div>
  );
};

export default Header;
