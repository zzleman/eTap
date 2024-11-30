import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import CreateVacancy from '../pages/CreateVacancy';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Vacancies from '../pages/Vacancies';
import VacancySingle from '../pages/VacancySingle';
const Routers = () => {
  const currentUser = useSelector(state => state.auth.currentUser);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/vacancies"
        element={
          <RequireAuth>
            <Vacancies />
          </RequireAuth>
        }
      />
      <Route
        path="/createVacancy"
        element={
          <RequireAuth>
            <CreateVacancy />
          </RequireAuth>
        }
      />
      <Route path="/vacancies/:id" element={<VacancySingle />} />
    </Routes>
  );
};

export default Routers;
