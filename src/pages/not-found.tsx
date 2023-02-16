import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const route = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      route('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <h4 style={{ textAlign: 'center', marginTop: '100' }}>
        the page was not Found
      </h4>
    </div>
  );
};

export default NotFound;
