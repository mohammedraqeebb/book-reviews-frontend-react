import React, {
  FC,
  useEffect,
  MouseEvent,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import { signin, signout } from '../features/user/user-slice';
import useRequest from '../hooks/use-request';

import styles from '../styles/Profile.module.scss';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineLike, AiOutlineHistory } from 'react-icons/ai';

import { Book } from './search';
import BookDetailsSearch from '../components/book-details-search/book-details-search. component';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../main';
import { CircularProgress } from '@mui/material';
import ErrorComponent from '../components/error.component';
import useUser from '../hooks/use-user';
import { usePortalContext } from '../contexts/portal-context';

const Profile = () => {
  const user = useAppSelector((state) => state.user.user);
  useUser();

  const dispatch = useAppDispatch();
  const router = useNavigate();
  const { setPortalMessage, setPortalShow } = usePortalContext();

  const [name, setName] = useState(user?.name ?? '');
  const [showNameForm, setShowNameForm] = useState(false);
  const [booksData, setBooksData] = useState<Book[]>([]);
  const [showBooks, setShowBooks] = useState({
    showLikedBooks: false,
    showViewedBooks: false,
  });

  const {
    doRequest: signOutRequest,
    errors: signOutRequestErrors,
    loading: signOutRequestLoading,
  } = useRequest<null>({
    url: `${BACKEND_URL}/auth/signout`,
    method: 'post',
    onSuccess: () => {
      dispatch(signout());
      router('/auth/signin');
      setPortalShow(true);
      setPortalMessage('signed out successfully');
    },
  });
  const {
    doRequest: nameChangeRequest,
    errors: nameChangeRequestErrors,
    loading: nameChangeRequestLoading,
  } = useRequest<null>({
    url: `${BACKEND_URL}/user/namechange`,
    method: 'post',
    body: { name },
    onSuccess: (data) => {
      dispatch(signin(data.user));

      setShowNameForm(false);
    },
  });

  const {
    doRequest: getLikedBooksRequest,
    errors: getLikedBooksRequestErrors,
    loading: getLikedBooksRequestLoading,
  } = useRequest({
    url: `${BACKEND_URL}/user/likedbooks`,
    method: 'post',
    body: {},
    onSuccess: (data) => {
      setBooksData(data.books);
    },
  });
  const {
    doRequest: getViewedBooksRequest,
    errors: getViewedBooksRequestErrors,
    loading: getViewedBooksRequestLoading,
  } = useRequest({
    url: `${BACKEND_URL}/user/viewedbooks`,
    method: 'post',
    body: {},
    onSuccess: (data) => {
      setBooksData(data.books);
    },
  });

  const setShowLikedBooks = async (event: MouseEvent<HTMLButtonElement>) => {
    setShowBooks({ showLikedBooks: true, showViewedBooks: false });
    await getLikedBooksRequest();
  };
  const setShowViewedBooks = async (event: MouseEvent<HTMLButtonElement>) => {
    setShowBooks({ showLikedBooks: false, showViewedBooks: true });
    await getViewedBooksRequest();
  };

  const handleSignout = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await signOutRequest();
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleNameChangeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await nameChangeRequest();
  };
  const handleShowForm = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowNameForm(true);
  };
  const activeButton = {
    background: '#000000',
    color: '#FFFFFF',
  };

  return (
    <div className={styles.profile_page_wrapper}>
      <div className={styles.profile_page_container}>
        <div className={styles.profile_details_section}>
          <div className={styles.profile_logo}>
            <h2>
              {user &&
                user.name
                  .split(' ')
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join('')
                  .toLocaleUpperCase()}
            </h2>
          </div>

          {signOutRequestErrors && (
            <ErrorComponent errors={signOutRequestErrors} />
          )}
          <button className={styles.signout_button} onClick={handleSignout}>
            {signOutRequestLoading ? (
              <CircularProgress color="inherit" size={12} />
            ) : (
              'sign out'
            )}
          </button>
          {!showNameForm && (
            <div className={styles.name_container}>
              <h3>{user?.name}</h3>
              <button onClick={handleShowForm} className={styles.edit_button}>
                <FiEdit2 color="" size={8} />
                <p className={styles.button_text}> name</p>
              </button>
            </div>
          )}
          {showNameForm && (
            <form
              className={styles.name_change_form_container}
              onSubmit={handleNameChangeSubmit}
            >
              <input
                value={name}
                className={styles.name_change_form_input}
                onChange={handleNameChange}
              />
              <button
                type="submit"
                onClick={handleNameChangeSubmit}
                className={styles.name_change_submit_button}
              >
                {nameChangeRequestLoading ? (
                  <CircularProgress color="primary" size={12} />
                ) : (
                  'change name'
                )}
              </button>
              {}
              <button
                className={styles.name_change_cancel_button}
                type="button"
                onClick={() => setShowNameForm(false)}
              >
                cancel
              </button>
              {nameChangeRequestErrors && (
                <ErrorComponent errors={nameChangeRequestErrors} />
              )}
            </form>
          )}
        </div>
        <div className={styles.book_section}>
          <div className={styles.book_section_buttons}>
            <button
              className={styles.liked_books_button}
              onClick={setShowLikedBooks}
              style={showBooks.showLikedBooks ? activeButton : {}}
            >
              <AiOutlineLike
                color={showBooks.showLikedBooks ? '#FFFFFF' : '#000000'}
                size={12}
              />
              <p className={styles.button_text}>liked books</p>
            </button>
            <button
              className={styles.viewed_books_button}
              onClick={setShowViewedBooks}
              style={showBooks.showViewedBooks ? activeButton : {}}
            >
              <AiOutlineHistory
                size={12}
                color={showBooks.showViewedBooks ? '#FFFFFF' : '#000000'}
              />
              <p className={styles.button_text}>viewed books</p>
            </button>
          </div>
          <div className={styles.books_container}>
            {getLikedBooksRequestLoading && (
              <CircularProgress
                color="inherit"
                style={{ margin: '20px auto' }}
              />
            )}
            {getViewedBooksRequestLoading && (
              <CircularProgress
                color="inherit"
                style={{ margin: '20px auto' }}
              />
            )}
            {getLikedBooksRequestErrors && (
              <ErrorComponent errors={getLikedBooksRequestErrors} />
            )}
            {getViewedBooksRequestErrors && (
              <ErrorComponent errors={getViewedBooksRequestErrors} />
            )}
            {!getLikedBooksRequestLoading &&
              !getViewedBooksRequestLoading &&
              booksData.length > 0 &&
              booksData.map((currentBook) => (
                <BookDetailsSearch key={currentBook.id} {...currentBook} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
