import { Skeleton } from '@mui/material';
import React from 'react';
import useWindowWidth from '../hooks/use-window-width';

const BookDetailsPageSkeleton = () => {
  let width = useWindowWidth();

  width = width > 1000 ? 900 : width;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        gap: '30px',
        padding: '0px 10px 0px 10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: width > 420 ? (width > 700 ? '70px' : '50px') : '20px',
          alignSelf: 'flex-start',
        }}
      >
        <Skeleton
          variant="rectangular"
          height={width > 420 ? 350 : 300}
          width={150}
        />
        <div>
          <Skeleton
            animation="wave"
            height={30}
            width={width > 420 ? 300 : 200}
            style={{ marginBottom: 20 }}
          />
          <Skeleton
            animation="wave"
            height={30}
            width={width > 420 ? 200 : 150}
            style={{ marginBottom: 15 }}
          />
          <Skeleton
            animation="wave"
            height={30}
            width={width > 420 ? 150 : 100}
            style={{ marginBottom: 12 }}
          />
          <Skeleton
            animation="wave"
            height={30}
            width={width > 420 ? 100 : 70}
            style={{ marginBottom: 20 }}
          />
          <Skeleton
            variant="rectangular"
            height={width > 420 ? 200 : 150}
            width={width > 420 ? 200 : 150}
          />
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPageSkeleton;
