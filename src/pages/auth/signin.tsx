import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import FormInputText from '../../components/form-input-text.tsx/form-input-text.component';
import styles from '../../styles/Signin.module.scss';

import Button from '../../components/button/button.component';

import useRequest from '../../hooks/use-request';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signin } from '../../features/user/user-slice';
import { validateEmail, validatePassword } from '../../util/validation/auth';
import { isButtonDisabled } from '../../util/validation/enable-button';
import ErrorComponent from '../../components/error.component';

import usePortal from '../../hooks/use-portal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../main';
import { CircularProgress } from '@mui/material';

import useUserAuthPage from '../../hooks/use-user-auth-page';
import { usePortalContext } from '../../contexts/portal-context';

const INITIAL_SIGN_IN_FIELDS = {
  email: '',
  password: '',
};

const Signin = ({}) => {
  useUserAuthPage();
  const { setPortalMessage, setPortalShow } = usePortalContext();
  const location = useLocation();
  const previousPathname: string = location.state?.referrer || '/';
  const dispatch = useAppDispatch();
  const router = useNavigate();

  const [signinFormFields, setSigninFormFields] = useState(
    INITIAL_SIGN_IN_FIELDS
  );
  const [signinFormErrors, setSigninFormErrors] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const { doRequest, errors, loading } = useRequest({
    url: `${BACKEND_URL}/auth/signin`,
    method: 'post',
    onSuccess: (data) => {
      setPortalShow(true);
      setPortalMessage('you are signed in');
      dispatch(signin(data.user));
      localStorage.setItem('token', data.token);
      if (previousPathname.startsWith('/auth')) {
        router('/');
      } else {
        router(-1);
      }
    },
    body: signinFormFields,
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSigninFormFields({ ...signinFormFields, [name]: value });
    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          setSigninFormErrors({ ...signinFormErrors, email: true });
          return;
        }

        setSigninFormErrors({ ...signinFormErrors, email: false });
        break;

      case 'password':
        const errorInPassword = !validatePassword(value);
        if (errorInPassword) {
          setSigninFormErrors({ ...signinFormErrors, password: true });
          return;
        }

        setSigninFormErrors({ ...signinFormErrors, password: false });
        break;
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className={styles.signin_wrapper}>
      <div className={styles.signin_form_wrapper}>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          <h4>Signin form</h4>
          <FormInputText
            autoComplete="off"
            type="email"
            hasError={signinFormErrors.email}
            name="email"
            onChange={handleChange}
            label="Email"
            required={true}
          />
          <div className={styles.password_input_container}>
            <FormInputText
              hasError={signinFormErrors.password}
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              info
              validationMessage="must contain a small letter, capital letter, a digit,a special character and password length of atleast eight characters"
              onChange={handleChange}
              required={true}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.password_show_control_icon}
            >
              {showPassword ? (
                <AiOutlineEye size={16} />
              ) : (
                <AiOutlineEyeInvisible size={16} />
              )}
            </span>
          </div>
          <Link
            to="/auth/forgot-password"
            className={styles.forgotten_password_page_link}
          >
            Forgotten Password?
          </Link>
          {errors && <ErrorComponent errors={errors} />}
          <Button
            disabled={isButtonDisabled(
              INITIAL_SIGN_IN_FIELDS,
              signinFormFields,
              signinFormErrors
            )}
            type="submit"
            onClick={handleSubmit}
            width="100%"
          >
            {loading ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              'Sign in'
            )}
          </Button>
          <div className={styles.signup_description}>
            <p>Don&apos;t have an account? </p>
            <p
              onClick={() => router('/auth/signup', { replace: true })}
              className={styles.signup_page_link}
            >
              Create One
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
