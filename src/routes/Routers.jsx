import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import CreateResumes from '../pages/CreateResumes';
import CreateVacancy from '../pages/CreateVacancy';
import DateRangeForm from '../pages/DateRangeForm';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Resumes from '../pages/Resumes';
import ResumeSingle from '../pages/ResumeSingle';
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
      <Route path="/vacancies/:categoryId/:id" element={<VacancySingle />} />
      <Route path="/resumes/:id" element={<ResumeSingle />} />

      <Route
        path="/createResumes"
        element={
          <RequireAuth>
            <CreateResumes />
          </RequireAuth>
        }
      />
      <Route
        path="/resumes"
        element={
          <RequireAuth>
            <Resumes />
          </RequireAuth>
        }
      />
      <Route path="/salam" element={<DateRangeForm />} />
    </Routes>
  );
};

export default Routers;
