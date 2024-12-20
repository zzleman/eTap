import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import Company from '../pages/Company';
import CreateResumes from '../pages/CreateResumes';
import CreateVacancy from '../pages/CreateVacancy';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Resumes from '../pages/Resumes';
import ResumeSingle from '../pages/ResumeSingle';
import Vacancies from '../pages/Vacancies';
import VacanciesDashboard from '../pages/VacanciesDashboard';
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
      <Route
        path="/vacancies/:categoryId/:id"
        element={
          <RequireAuth>
            <VacancySingle />
          </RequireAuth>
        }
      />
      <Route
        path="/resumes/:id"
        element={
          <RequireAuth>
            <ResumeSingle />
          </RequireAuth>
        }
      />

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
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <VacanciesDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/companyDetails"
        element={
          <RequireAuth>
            <Company />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default Routers;
