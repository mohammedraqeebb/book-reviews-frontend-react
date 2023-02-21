import axios from 'axios';

import React, { useEffect, useState } from 'react';

import BookDetailsSearch from '../components/book-details-search/book-details-search. component';
import SavedBooksList from '../components/saved-books-list/saved-books-list.component';
import useRequest from '../hooks/use-request';
import { Book } from './search';

import styles from '../styles/Saved.module.scss';
import PageSkeleton from '../components/page-skeleton.component';
import { BACKEND_URL } from '../main';
import ErrorComponent from '../components/error.component';
import useUser from '../hooks/use-user';

type SavedPageProps = {
  savedBooks: Book[];
};

const Saved = () => {
  useUser();
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  const {
    doRequest: getAllSavedBooksRequest,
    errors: getAllSavedBooksRequestErrors,
    loading: getAllSavedBooksRequestLoading,
  } = useRequest({
    url: `${BACKEND_URL}/book/saved/all`,
    method: 'post',
    body: {},
    onSuccess: (data) => {
      setSavedBooks(data.savedBooks);
    },
  });
  useEffect(() => {
    const fetchSavedBooks = async () => {
      await getAllSavedBooksRequest();
    };
    fetchSavedBooks();
  }, []);

  if (getAllSavedBooksRequestLoading) {
    return (
      <div className={styles.saved_page_wrapper}>
        <div className={styles.saved_page_container}>
          <PageSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.saved_page_wrapper}>
      <div className={styles.saved_page_container}>
        <h3>Saved Books</h3>
        {getAllSavedBooksRequestErrors && (
          <ErrorComponent errors={getAllSavedBooksRequestErrors} />
        )}
        <SavedBooksList books={savedBooks} />
      </div>
    </div>
  );
};

export default Saved;
