import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import * as React from 'react';
import { useAppSelector } from '../app/hooks';

type Method = 'get' | 'post' | 'put' | 'delete';

type useRequestParameters = {
  url: string;
  method: Method;
  body?: any;
  onSuccess: (data: any) => void;
  authenticated?: boolean;
};
type ErrorFormat = {
  message: string;
  field?: string;
};

const useRequest = <T>({
  url,
  method,
  body,
  onSuccess,
  authenticated = false,
}: useRequestParameters) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<null | ErrorFormat[]>(null);
  const user = useAppSelector((state) => state.user.user);
  const router = useNavigate();
  const doRequest = async () => {
    let cancel;
    if (authenticated && !user) {
      router('/auth/signin');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios[method]<T>(
        url,
        {
          ...body,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') ?? null}`,
          },
        }
      );

      setLoading(false);
      onSuccess(data);

      return data;
    } catch (axiosError) {
      setLoading(false);
      if (axios.isCancel(axiosError)) {
        return;
      }

      if (axios.isAxiosError(axiosError)) {
        // if (axiosError.status === 401) {
        //   router('/auth/signin');
        // }
        //@ts-ignore
        setErrors(axiosError.response?.data.errors as ErrorFormat[]);
      }
      setTimeout(() => {
        setErrors(null);
      }, 5000);
    }
  };
  return { errors, doRequest, loading };
};

export default useRequest;
