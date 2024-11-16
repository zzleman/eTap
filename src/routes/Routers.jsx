import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Vacancies from '../pages/Vacancies';
const Routers = () => {
  const currentUser = useSelector(state => state.auth.currentUser);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  console.log(currentUser);

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
    </Routes>
  );
};

export default Routers;
