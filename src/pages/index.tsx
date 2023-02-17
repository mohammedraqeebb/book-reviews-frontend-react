import axios from 'axios';

import { useEffect, useState } from 'react';

import BooksList from '../components/books-list/books-list.component';
import ErrorComponent from '../components/error.component';
import HomePageSkeleton from '../components/home-page-skeleton.component';
import { usePortalContext } from '../contexts/portal-context';

import useRequest from '../hooks/use-request';
import { BACKEND_URL } from '../main';
import styles from '../styles/Home.module.scss';
import { Book } from './search';

const Home = () => {
  const [mostLikedBooks, setMostLikedBooks] = useState<Book[]>([]);
  const [mostViewedBooks, setMostViewedBooks] = useState<Book[]>([]);
  const { setPortalMessage: setMessage, setPortalShow: setShow } =
    usePortalContext();
  const {
    doRequest: getMostLikedBooksRequest,
    errors: getMostLikedBooksRequestErrors,
    loading: getMostLikedBooksRequestLoading,
  } = useRequest({
    url: `${BACKEND_URL}/book/likes/mostliked`,
    method: 'get',
    onSuccess: (data) => {
      setMostLikedBooks(data.books);
    },
  });
  const {
    doRequest: getMostViewedBooksRequest,
    errors: getMostViewedBooksRequestErrors,
    loading: getMostViewedBooksRequestLoading,
  } = useRequest({
    url: `${BACKEND_URL}/book/views/mostViewed`,
    method: 'get',
    onSuccess: (data) => {
      setMostViewedBooks(data.books);
    },
  });
  const fetchData = async () => {
    await Promise.all([
      getMostLikedBooksRequest(),
      getMostViewedBooksRequest(),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (getMostLikedBooksRequestLoading || getMostViewedBooksRequestLoading) {
    return (
      <div className={styles.home_page_wrapper}>
        <div className={styles.home_page_container}>
          <HomePageSkeleton />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={styles.home_page_wrapper}>
        <div className={styles.home_page_container}>
          {getMostLikedBooksRequestErrors && (
            <ErrorComponent errors={getMostLikedBooksRequestErrors} />
          )}
          {getMostViewedBooksRequestErrors && (
            <ErrorComponent errors={getMostViewedBooksRequestErrors} />
          )}
          <BooksList books={mostLikedBooks} listTitle="most liked books" />
          <BooksList books={mostViewedBooks} listTitle="most viewed books" />
        </div>
      </div>
    </>
  );
};
export default Home;
