import React, { useState, useEffect } from 'react';
import { userIDValidator, passwordValidator } from '../../auth/validations/Validator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Loader from '../../components/loader/Loader';
import { Helmet } from 'react-helmet-async';
import { UserLogin } from '../../auth/services/Services';
import { signIn } from '../../state/reducers/authSlice';

import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa6';
import Logo from '/icons/bosch_logo.png';
import bgImage from '/img/login_bg.png';

const LoginPage = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const discomeName = import.meta.env.VITE_APP_DISCOME_NAME;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clickToLogin = () => {
    toast.dismiss();
    if (userIDValidator(userID)) {
      toast.error(userIDValidator(userID));
      return;
    }
    if (passwordValidator(password)) {
      toast.error(passwordValidator(password));
      return;
    }

    setIsLoading(true);
    UserLogin(userID, password)
      .then((res) => {
        if (res?.status === true) {
          toast.success('Login Successfully !!');
          res.userID = userID;
          dispatch(signIn(res));
          setTimeout(() => {
            navigate(`/dashboard/app`);
          }, 2000);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong !!');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      clickToLogin();
    }
  };

  return (
    <>
      <Helmet>
        <title>BOSCH | Login</title>
      </Helmet>
      <Loader propData={isLoading} />
      <div className="h-full bg-white relative flex items-center justify-center">
        <div>
          <img src={bgImage} alt="Background Image" className="absolute inset-0 object-cover h-full w-full" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-r from-[#0f81e2] to-[#c28cdf] opacity-90" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-10 text-white w-full justify-center">
          <div className="flex flex-col items-center md:items-start z-10 md:mx-auto">
            <h1 className="text-[1rem] md:text-[1.3rem] lg:text-[1.57rem] font-bold md:text-left pt-3 md:-mt-16 lg:-mt-[18] text-nowrap">
              {discomeName}
            </h1>
            <img
              src={Logo}
              alt="Logo"
              className="flex w-16 h-16 md:h-[19] md:w-[19] lg:w-20 lg:h-20 object-contain mt-8"
            />
            <h1 className="text-base md:text-xl lg:text-2xl font-semibold md:text-left mt-2">Analytic Dashboard</h1>
            <p className="text-xs md:text-sm text-center md:text-left">
              Please Log in to access your insights and reports.
            </p>
          </div>

          {/* <div className="mt-6"></div> */}
          <div className="h-full bg-[#fff] p-6 lg:p-10 rounded-3xl shadow-lg max-w-sm md:max-w-md w-full z-10 mx-auto">
            <h2 className="text-base md:text-lg lg:text-xl text-gray-700 font-semibold">
              Welcome to <span className="text-blue-500">MDM Dashboard</span>
            </h2>
            <h1 className="text-[1rem] md:text-[1.3rem] lg:text-[1.57rem] font-bold mb-4 mt-2 text-gray-700">
              Sign in
            </h1>
            {/* <div className="border-b-[0.6px] mb-3 border-gray-700"></div> */}
            <div className="space-y-4 md:space-y-6">
              <div className="login-page">
                <label className="block text-sm font-semibold text-gray-700">Enter User ID</label>
                <input
                  type="text"
                  placeholder="UserID"
                  value={userID}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setUserID(e.target.value)}
                  className="text-gray-600 mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="login-page">
                <label className="block text-sm font-semibold text-gray-700">Enter Password</label>
                <div className="relative">
                  <input
                    // autoComplete="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-gray-600 mt-2 block w-full p-3 pr-12 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-600"
                  >
                    {showPassword ? <FaRegEyeSlash className="h-6 w-6" /> : <IoEyeOutline className="h-6 w-6" />}
                  </button>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#0f81e2] to-[#c28cdf] text-lg text-white p-2 md:p-3 rounded-xl font-semibold hover:opacity-90"
                onClick={clickToLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
