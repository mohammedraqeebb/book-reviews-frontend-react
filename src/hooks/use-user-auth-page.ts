import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  User,
  UserRequestResponse,
} from '../components/header/header.component';
import { BACKEND_URL } from '../main';
import useRequest from './use-request';

const useUserAuthPage = () => {
  const route = useNavigate();
  const { doRequest, errors } = useRequest<UserRequestResponse>({
    url: `${BACKEND_URL}/auth/currentuser`,
    method: 'post',
    onSuccess: (data) => {},
  });
  let user: null | User = null;
  const fetchData = async () => {
    const currentUserData = await doRequest();
    user = currentUserData!.user;
    if (user) {
      route('/profile');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};

export default useUserAuthPage;
