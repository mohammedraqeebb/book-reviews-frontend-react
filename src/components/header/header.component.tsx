import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { signin } from '../../features/user/user-slice';
import useRequest from '../../hooks/use-request';
import { BACKEND_URL } from '../../main';

import Logo from '../../static/assets/icons/logo.icon';
import styles from './Header.module.scss';
export type User = {
  id: string;
  name: string;
};

export type UserRequestResponse = {
  user: User | null;
};

const Header = () => {
  const dispatch = useAppDispatch();
  const { doRequest, errors } = useRequest<UserRequestResponse>({
    url: `${BACKEND_URL}/auth/currentuser`,
    method: 'post',
    onSuccess: (data) => {
      dispatch(signin(data.user));
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      await doRequest();
    };
    fetchUser();
  }, []);
  return (
    <Link to="/" className={styles.header_container}>
      <Logo />
    </Link>
  );
};

export default Header;
