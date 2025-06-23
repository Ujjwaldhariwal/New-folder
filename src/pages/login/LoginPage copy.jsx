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
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-r from-[#0f81e2] to-[#c28cdf] opacity-95" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mx-4 text-white w-full justify-center">
          <div className="flex flex-col items-center md:items-start pt-2 z-10 ml-0 md:mx-auto">
            <img src={Logo} alt="Logo" className="flex w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold md:text-left mt-2 md:mt-3">Analytic Dashboard</h1>
            <p className="md:text-lg md:text-left">Please Log in to access your insights and reports.</p>
          </div>

          {/* <div className="mt-6"></div> */}
          <div className="h-full bg-[#fff] p-6 md:p-12 rounded-3xl shadow-lg max-w-sm md:max-w-md w-full z-10 mx-auto">
            <h2 className="text-lg md:text-xl text-gray-700 font-semibold">
              Welcome to <span className="text-blue-500">MDMS</span>
            </h2>
            <h1 className="text-xl md:text-3xl font-bold mb-4 mt-2 text-gray-700">Sign in</h1>
            {/* <div className="border-b-[0.6px] mb-3 border-gray-700"></div> */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Enter your User ID or email address</label>
                <input
                  type="text"
                  placeholder="UserID or email address"
                  value={userID}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setUserID(e.target.value)}
                  className="text-gray-600 mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Enter your Password</label>
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
                className="w-full bg-gradient-to-r from-[#0f81e2] to-[#c28cdf] text-lg text-white py-2 md:py-3 rounded-lg font-semibold hover:opacity-90"
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
