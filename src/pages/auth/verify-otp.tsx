import React, { useState, useEffect, FormEvent, MouseEvent } from 'react';
import styles from '../../styles/VerifyOTP.module.scss';
import { AiFillRightCircle } from 'react-icons/ai';

import useRequest from '../../hooks/use-request';

import ErrorComponent from '../../components/error.component';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../main';
import { CircularProgress } from '@mui/material';

const VerifyOTP = () => {
  const [OTP, setOTP] = useState(['', '', '', '', '', '']);
  const router = useNavigate();
  const [timer, setTimer] = useState(120);
  const [email, setEmail] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (OTP[activeIndex] !== '') {
        OTP[activeIndex] = '';
        let newOTP = [...OTP];
        newOTP[activeIndex] = '';
        setOTP(newOTP);
      } else if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    } else if (e.key.match(/^[0-9]$/)) {
      if (activeIndex === 5 && OTP[activeIndex] !== '') {
        return;
      }
      const newOTP = [...OTP];
      newOTP[activeIndex] = e.key;
      setOTP(newOTP);
      if (activeIndex < 5) {
        setActiveIndex(activeIndex + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleKeyBoardShow = () => {
    if (activeIndex === 0) {
      setActiveIndex(0);
      const virtualInput = document.createElement('input');
      virtualInput.style.position = 'fixed';
      virtualInput.style.left = '100vw';
      virtualInput.style.top = '100vh';
      virtualInput.type = 'number';
      document.body.appendChild(virtualInput);
      virtualInput.focus();
      virtualInput.addEventListener('blur', () => {
        document.body.removeChild(virtualInput);
      });
    }
  };
  const { doRequest, errors, loading } = useRequest({
    url: `${BACKEND_URL}/auth/verifyotp`,
    method: 'post',
    body: { otp: parseInt(OTP.join('')), email },
    onSuccess: () => {
      router('/auth/change-password');
    },
  });
  useEffect(() => {
    setEmail(localStorage.getItem('email') ?? '');
  }, []);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doRequest();
  };

  useEffect(() => {
    if (timer <= 0) {
      router(-1);
    }
    const setInternalTime = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(setInternalTime);
  }, [timer]);
  return (
    <div className={styles.otp_wrapper}>
      <div className={styles.otp_container}>
        <div
          className={styles.otp_input_container}
          onClick={handleKeyBoardShow}
          tabIndex={0}
          inputMode="numeric"
        >
          <form onSubmit={handleSubmit} className={styles.form_container}>
            {OTP.map((digit, index) => (
              <div
                key={index}
                className={`${styles.otp_digit} ${
                  activeIndex === index ? styles.active : ''
                }`}
              >
                {digit}
              </div>
            ))}
            <button
              disabled={OTP[5] === ''}
              className={styles.otp_submit_button}
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress color="inherit" size={12} />
              ) : (
                <AiFillRightCircle
                  color={OTP[5] === '' ? '#9dd4fa' : '#04395e'}
                  size={20}
                />
              )}
            </button>
          </form>
        </div>

        <p className={styles.timer_container}>
          you have <span>{timer}</span> seconds left{' '}
        </p>
        {errors && <ErrorComponent errors={errors} />}
      </div>
    </div>
  );
};

export default VerifyOTP;
