import React from 'react';
import authBg from '../assets/img/auth-bg.jpeg';
import logo from '../assets/icon/etap-logo.png';
import { ErrorMessage, useFormik } from 'formik';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { loginSchema } from '../schemas/LoginSchema';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../redux/authSlice';
import { setUser } from '../utils/localStorageUtils';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (values, actions) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      dispatch(setCurrentUser(user));
      setUser(user);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      toast.success('User logged in successfully!', { position: 'top-center' });
      actions.resetForm();
    } catch (error) {
      toast.error(error.message, { position: 'bottom-center' });
    }
  };
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <div
      className="register h-screen relative w-full bg-cover"
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      <div className="absolute inset-0 bg-[#2A1B41] opacity-50"></div>

      <div className="relative z-10 text-white flex flex-col max-w-6xl mx-auto justify-between h-screen">
        <div className="top my-10">
          <span>В начало</span>
        </div>
        <div className="middle flex w-12/12 items-center gap-36">
          <div className="left w-7/12">
            <img src={logo} alt="eTap logo" />
            <h3 className="text-xl font-bold my-4">
              Будьте в курсе всех вакансий Азербайджана
            </h3>
            <p className="text-sm">
              С новой функцией уведомлений вы будете получть уведомления о новых
              вакасиях на почтовый ящик. Так же вы можете скачать мобильное
              приложение которое позволит вам получать уведомления на телефон.
            </p>
          </div>
          <div className="right w-5/12 bg-[#573E7D] bg-opacity-50 h-[392px] text-center flex items-center rounded-sm">
            <div className="w-56 mx-auto flex flex-col min-h-60 max-h-96 gap-5">
              <p className="text-sm">Войти</p>
              <form
                onSubmit={handleSubmit}
                action=""
                className="flex flex-col gap-3 text-xs"
              >
                <input
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? 'input-error h-10 text-center outline-none text-black '
                      : 'h-10 text-center outline-none text-black'
                  }
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-left">{errors.email}</p>
                )}

                <input
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? 'input-error h-10 text-center outline-none text-black '
                      : 'h-10 text-center outline-none text-black'
                  }
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-left">{errors.password}</p>
                )}

                <button
                  disabled={isSubmitting}
                  className="h-10 bg-[#FFD751] text-black text-xs"
                  type="submit"
                >
                  Войти
                </button>
              </form>
              <Link to="/register">
                <p className="text-xs">Регистрация</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="bottom text-center my-2">
          <p>Все права защищены. 2019</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
