import { Skeleton } from '@mui/material';
import React from 'react';
import useWindowWidth from '../hooks/use-window-width';

const HomePageSkeleton = () => {
  let width = useWindowWidth();

  width = width > 1000 ? 900 : width * 0.85;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '0 10px 0 10px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'flex-start',
        }}
      >
        <Skeleton animation="wave" height={30} width={width * 0.3} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'flex-start',
        }}
      >
        <Skeleton animation="wave" height={30} width={width * 0.3} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
          <Skeleton variant="rectangular" height={250} width={150} />
        </div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;
