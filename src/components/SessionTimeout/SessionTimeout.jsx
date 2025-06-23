import React, { useEffect, useState } from 'react';

const SessionTimeout = () => {
  const [isIdle, setIsIdle] = useState(false);

  const IDLE_TIMEOUT = 10 * 60 * 1000;

  const resetTimer = () => {
    setIsIdle(false);
  };

  useEffect(() => {
    let idleTimer;

    const onActivity = () => {
      clearTimeout(idleTimer);
      resetTimer();
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, IDLE_TIMEOUT);
    };

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('mousedown', onActivity);
    window.addEventListener('touchstart', onActivity);

    idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIMEOUT);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('mousedown', onActivity);
      window.removeEventListener('touchstart', onActivity);
    };
  }, []);

  return isIdle;
};

export default SessionTimeout;
