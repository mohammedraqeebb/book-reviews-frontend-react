import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useState } from 'react';
import { AiFillStar, AiOutlineClose, AiOutlineStar } from 'react-icons/ai';
import useRequest from '../../hooks/use-request';
import { BACKEND_URL } from '../../main';
import { FetchRatingsResponseBodyType } from '../../pages/book/[id]';
import ErrorComponent from '../error.component';

import styles from './RatingPost.module.scss';

type RatingPostProps = {
  setShowRatingPost: React.Dispatch<React.SetStateAction<boolean>>;
  userRating: number;
  setUserRating: React.Dispatch<React.SetStateAction<number>>;
  setExecuteFetchRatings: React.Dispatch<React.SetStateAction<boolean>>;
  bookId: string;
  userRatingId: string;
  setUserRatingId: React.Dispatch<React.SetStateAction<string>>;
};

const createRatingArray = (userRating: number) => {
  const ratingsArray = new Array(11).fill(0);
  if (userRating !== 0) {
    for (let i = 1; i <= 10; i++) {
      if (i <= userRating) {
        ratingsArray[i] = 1;
      } else {
        ratingsArray[i] = 0;
      }
    }
  }
  return ratingsArray;
};

const RatingPost: FC<RatingPostProps> = ({
  setShowRatingPost,
  userRating,
  setUserRating,
  bookId,
  setExecuteFetchRatings,
  setUserRatingId,
  userRatingId,
}) => {
  const [ratingsArray, setRatingsArray] = useState(() =>
    createRatingArray(userRating)
  );

  const handleRatingChange = (idx: number) => {
    setUserRating(idx);
    for (let i = 1; i <= 10; i++) {
      if (i <= idx) {
        ratingsArray[i] = 1;
      } else {
        ratingsArray[i] = 0;
      }
    }
    setRatingsArray(ratingsArray);
  };

  const {
    doRequest: addBookRatingRequest,
    errors: addBookRatingRequestErrors,
    loading: addBookRatingRequestLoading,
  } = useRequest<FetchRatingsResponseBodyType>({
    url: `${BACKEND_URL}/book/rating/${bookId}/create`,
    method: 'post',
    authenticated: true,
    body: {
      rating: userRating,
    },
    onSuccess: (data) => {
      console.log(data);
      setUserRatingId(data.rating.id);
      setExecuteFetchRatings((value) => !value);
      setShowRatingPost(false);
    },
  });
  const {
    doRequest: editBookRatingRequest,
    errors: editBookRatingRequestErrors,
    loading: editBookRatingRequestLoading,
  } = useRequest<FetchRatingsResponseBodyType>({
    url: `${BACKEND_URL}/book/rating/${bookId}/${userRatingId}`,
    method: 'put',
    authenticated: true,
    body: {
      rating: userRating,
    },
    onSuccess: (data) => {
      setExecuteFetchRatings((value) => !value);
      setShowRatingPost(false);
    },
  });
  console.log(userRating, userRatingId, 'user rating');
  return (
    <AnimatePresence>
      <div className={styles.rating_post_container}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h3>post your rating</h3>
          <p className={styles.info_text}>rating should be atleast 1</p>

          <p
            className={`${styles.user_rating} ${
              userRating !== 0 ? styles.show : ''
            }`}
          >
            {userRating}/10 rating
          </p>

          <div className={styles.rating_container}>
            {ratingsArray.map((currentRating, idx) => {
              return (
                <span key={idx} onClick={() => handleRatingChange(idx)}>
                  {idx === 0 ? null : currentRating ? (
                    <AiFillStar size={16} />
                  ) : (
                    <AiOutlineStar size={16} />
                  )}
                </span>
              );
            })}
            {addBookRatingRequestErrors && (
              <ErrorComponent errors={addBookRatingRequestErrors} />
            )}
            {userRatingId === '' && (
              <button
                disabled={userRating === 0}
                className={styles.submit_post_button}
                onClick={() => addBookRatingRequest()}
              >
                {addBookRatingRequestLoading ? 'posting....' : 'post rating'}
              </button>
            )}
            {editBookRatingRequestErrors && (
              <ErrorComponent errors={editBookRatingRequestErrors} />
            )}
            {userRatingId !== '' && (
              <button
                disabled={userRating === 0}
                className={styles.submit_post_button}
                onClick={() => editBookRatingRequest()}
              >
                {addBookRatingRequestLoading ? 'editing....' : 'edit rating'}
              </button>
            )}
          </div>
          <span
            onClick={() => setShowRatingPost(false)}
            className={styles.close_icon_container}
          >
            <AiOutlineClose size={16} color="#000000" />
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RatingPost;
