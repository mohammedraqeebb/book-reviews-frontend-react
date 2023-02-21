import { CircularProgress } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/button.component';
import ErrorComponent from '../../components/error.component';
import FormInputText from '../../components/form-input-text.tsx/form-input-text.component';
import useRequest from '../../hooks/use-request';
import { BACKEND_URL } from '../../main';
import styles from '../../styles/ForgotPassword.module.scss';
import { validateEmail } from '../../util/validation/auth';

const ForgotPassword = () => {
  const router = useNavigate();
  const [email, setEmail] = useState('');
  const [emailValidationError, setEmailValidationError] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailValidationError(true);
      return;
    }
    setEmailValidationError(false);
  };
  const { doRequest, errors, loading } = useRequest({
    url: `${BACKEND_URL}/auth/forgotpassword`,
    method: 'post',
    body: { email },
    onSuccess: () => {
      localStorage.setItem('email', email);
      router('/auth/verify-otp');
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className={styles.forgot_password_wrapper}>
      <div className={styles.forgot_password_form_wrapper}>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          <p className={styles.forgot_password_header}>
            Enter your registered email
          </p>
          <FormInputText
            autoComplete="off"
            hasError={emailValidationError}
            type="email"
            label="Email (please check spam)"
            info
            validationMessage="check spam,,also, sometimes you may not recieve otp if the sent email is blocked my microsoft"
            name="email"
            value={email}
            placeholder="tom@example.com"
            onChange={handleChange}
            required={true}
          />
          {errors && <ErrorComponent errors={errors} />}
          <p className={styles.signup_description}>
            Didn&apos;t find your account?
            <Link className={styles.signup_page_link} to="/auth/signup">
              Create One
            </Link>
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!validateEmail(email)}
            type="submit"
            width="100%"
          >
            {loading ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              ' Get OTP'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
