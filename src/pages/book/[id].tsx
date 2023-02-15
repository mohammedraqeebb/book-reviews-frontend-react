import axios from 'axios';

import React, {
  useState,
  MouseEvent,
  useEffect,
  FormEvent,
  useCallback,
  useReducer,
} from 'react';
import { Book, INITIAL_BOOK_DATA } from '../search';

import styles from '../../styles/BookDetails.module.scss';

import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
  AiFillEye,
  AiFillRightCircle,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';
import { GrLinkUp } from 'react-icons/gr';

import { convertToWordedDate } from '../../util/convert-to-worded-date';
import CommentType from '../../components/comment/comment.component';
import Comment from '../../components/comment/comment.component';
import useRequest from '../../hooks/use-request';

import { UserState } from '../../features/user/user-slice';
import { roundOffNumber } from '../../util/round-off-number';
import SavedIcon from '../../static/assets/icons/saved.icon';
import SavedActiveIcon from '../../static/assets/icons/saved-active.icon';

import { INITIAL_LIKE_STATE, likeReducer } from '../../reducers/like-reducer';
import { Skeleton } from '@mui/material';
import PageSkeleton from '../../components/page-skeleton.component';
import { BACKEND_URL } from '../../main';
import { Link, useParams } from 'react-router-dom';
import RatingPost from '../../components/rating-post/rating-post.component';
import BookDetailsPageSkeleton from '../../components/book-details-page-skeleton.component copy';

//@ts-ignore
type User = {
  id: string;
  name: string;
};
export type CommentType = {
  id: string;
  bookId: string;
  comment: string;
  commentor: User;
  updatedAt: string;
};
type BookDetailsProps = {
  id: string;
};
type RouterQuery = {
  id: string;
};

type RatingsType = {
  rating: number;
  userId: string;
  id: string;
  bookId: string;
};

type BookDetailsResponseBodyType = {
  book: Book;
};
type FetchCommentsResponseBodyType = {
  comments: CommentType[];
};
export type FetchRatingsResponseBodyType = {
  ratings: RatingsType[];
};

type CurrentUserResponseBodyType = {
  user: User | null;
};
type UserSavedBooksResponseBodyType = {
  savedBooks: Book[];
};

const getAverageRating = (ratings: RatingsType[]) => {
  if (ratings.length === 0) {
    return 0;
  }
  const ratingsSum = ratings.reduce((total, currentValue) => {
    return total + currentValue.rating;
  }, 0);

  return (ratingsSum / ratings.length).toFixed(1);
};
type BookDetailsParams = {
  id: string;
};

const BookDetails = () => {
  const { id } = useParams<BookDetailsParams>() as BookDetailsParams;
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [bookPageLoading, setBookPageLoading] = useState(false);
  const [userRequestLoading, setUserRequestLoading] = useState(true);
  const [likeState, dispatch] = useReducer(likeReducer, INITIAL_LIKE_STATE);
  const [user, setUser] = useState<UserState | null>(null);
  const [isBookSaved, setIsBookSaved] = useState(false);
  const [executeFetchComments, setExecuteFetchComments] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [comment, setcomment] = useState('');
  const [showRatingPost, setShowRatingPost] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userRatingId, setUserRatingId] = useState('');
  const [ratings, setRatings] = useState<RatingsType[]>([]);
  const [executeFetchRatings, setExecuteFetchRatings] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const {
    doRequest: fetchCommentsRequest,
    errors: fetchCommentsRequestErrors,
  } = useRequest({
    url: `${BACKEND_URL}/book/comment/${id}/all`,
    method: 'post',
    onSuccess: (data) => {
      setComments(data.comments);
    },
  });

  const {
    doRequest: fetchCommentsRequestOnMount,
    errors: fetchCommentsRequestOnMountErrors,
  } = useRequest<FetchCommentsResponseBodyType>({
    url: `${BACKEND_URL}/book/comment/${id}/all`,
    method: 'post',
    onSuccess: (data) => {},
  });

  const { doRequest: bookDetailsRequest, errors: bookDetailsRequestErrors } =
    useRequest<BookDetailsResponseBodyType>({
      url: `${BACKEND_URL}/book/${id}`,
      method: 'get',
      onSuccess: () => {},
    });
  const {
    doRequest: fetchBookRatingsRequestOnMount,
    errors: fetchBookRatingsRequestOnMountErrors,
  } = useRequest<FetchRatingsResponseBodyType>({
    url: `${BACKEND_URL}/book/rating/${id}/all`,
    method: 'get',
    onSuccess: () => {},
  });

  const {
    doRequest: fetchBookRatingsRequest,
    errors: fetchBookRatingsRequestErrors,
  } = useRequest<FetchRatingsResponseBodyType>({
    url: `${BACKEND_URL}/book/rating/${id}/all`,
    method: 'get',
    onSuccess: (data) => {
      setRatings(data.ratings);
    },
  });

  const {
    doRequest: userSavedBooksRequest,
    errors: userSavedBooksRequestErrors,
  } = useRequest<UserSavedBooksResponseBodyType>({
    url: `${BACKEND_URL}/book/saved/all`,
    method: 'post',
    onSuccess: () => {},
  });

  const { doRequest: currentUserRequest, errors: currentUserRequestErrors } =
    useRequest<CurrentUserResponseBodyType>({
      url: `${BACKEND_URL}/auth/currentuser`,
      method: 'post',
      onSuccess: () => {},
    });

  const loadInitialData = async () => {
    const [bookData, commentData, userData, ratingsData] = await Promise.all([
      bookDetailsRequest(),
      fetchCommentsRequestOnMount(),
      currentUserRequest(),
      fetchBookRatingsRequestOnMount(),
    ]);
    if (!bookData || !commentData || !userData || !ratingsData) {
      return;
    }
    setBook(bookData.book);
    setComments(commentData.comments);
    setUser(userData!.user);
    setBookPageLoading(false);
    setRatings(ratingsData?.ratings);
    const hasuserLiked = !userData.user
      ? false
      : bookData.book.likes.includes(userData.user.id)
      ? true
      : false;

    const hasUserDisliked = !userData.user
      ? false
      : bookData.book.dislikes.includes(userData.user.id)
      ? true
      : false;
    if (!userData.user) {
      setUserRequestLoading(false);
    } else if (userData.user) {
      const savedBooksData = await userSavedBooksRequest();
      setIsBookSaved(
        savedBooksData?.savedBooks.find(
          (currentBook: Book) => currentBook.id === id
        )
          ? true
          : false
      );

      const userRating = ratingsData.ratings.find(
        (currentRating) => currentRating.userId === userData.user?.id
      );

      if (userRating) {
        setUserRating(userRating.rating);
        setUserRatingId(userRating.id);
      }

      setUserRequestLoading(false);
    }

    dispatch({
      type: 'SET_LIKE_STATE',
      payload: {
        liked: hasuserLiked,
        numberOfLikes: bookData.book.likes.length,
        disliked: hasUserDisliked,
        numberOfDislikes: bookData.book.dislikes.length,
      },
    });
  };
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!book) {
      return;
    }
    fetchCommentsRequest();
  }, [executeFetchComments]);
  useEffect(() => {
    if (!book) {
      return;
    }
    fetchBookRatingsRequest();
  }, [executeFetchRatings]);

  const { doRequest: addLikeRequest, errors: addLikeErrors } = useRequest({
    url: `${BACKEND_URL}/book/${id}/like/add`,
    method: 'post',
    authenticated: true,
    onSuccess: () => {},
  });
  const { doRequest: removeLikeRequest, errors: removeLikeErrors } = useRequest(
    {
      url: `${BACKEND_URL}/book/${id}/like/remove`,
      method: 'post',
      authenticated: true,
      onSuccess: () => {},
    }
  );
  const { doRequest: addDislikeRequest, errors: addLikeRequestErrors } =
    useRequest({
      url: `${BACKEND_URL}/book/${id}/dislike/add`,
      method: 'post',
      authenticated: true,
      onSuccess: () => {},
    });
  const {
    doRequest: removeDislikeRequest,
    errors: removeDislikeRequestErrors,
  } = useRequest({
    url: `${BACKEND_URL}/book/${id}/dislike/remove`,
    method: 'post',
    authenticated: true,
    onSuccess: () => {},
  });
  const clickLikeEvent = async (event: MouseEvent) => {
    event.stopPropagation();
    await addLikeRequest();
    if (user) {
      dispatch({ type: 'ADD_LIKE' });
    }
  };
  const removeLikeEvent = async (event: MouseEvent) => {
    event.stopPropagation();
    await removeLikeRequest();
    if (user) {
      dispatch({ type: 'REMOVE_LIKE' });
    }
  };
  const clickDislikeEvent = async (event: MouseEvent) => {
    event.stopPropagation();

    await addDislikeRequest();
    if (user) {
      dispatch({ type: 'ADD_DISLIKE' });
    }
  };
  const removeDislikeEvent = async (event: MouseEvent) => {
    event.stopPropagation();

    await removeDislikeRequest();
    if (user) {
      dispatch({ type: 'REMOVE_DISLIKE' });
    }
  };

  const { doRequest: addCommentRequest, errors: addCommentRequestErrors } =
    useRequest({
      url: `${BACKEND_URL}/book/comment/${id}/create`,
      method: 'post',
      body: { comment },
      authenticated: true,
      onSuccess: (data) => {
        setExecuteFetchComments((value) => !value);
        setcomment('');
      },
    });
  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await addCommentRequest();
  };

  const { doRequest: addViewRequest, errors: addViewRequestErrors } =
    useRequest({
      url: `${BACKEND_URL}/book/${id}/view`,
      method: 'post',
      onSuccess: () => {},
    });

  const {
    doRequest: addBookToSavedListRequest,
    errors: addBookToSavedListRequestErrors,
  } = useRequest({
    url: `${BACKEND_URL}/book/saved/${id}/create`,
    method: 'post',
    authenticated: true,
    onSuccess: () => {},
  });
  const {
    doRequest: deleteBookFromSavedListRequest,
    errors: deleteBookFromSavedListRequestErrors,
  } = useRequest({
    url: `${BACKEND_URL}/book/saved/${id}/delete`,
    method: 'post',
    authenticated: true,
    onSuccess: () => {},
  });

  const handleSave = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (user) {
      setIsBookSaved(true);
    }
    await addBookToSavedListRequest();
  };
  const handleUnsave = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (user) {
      setIsBookSaved(false);
    }
    await deleteBookFromSavedListRequest();
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      addViewRequest();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!book || !comments || bookPageLoading || userRequestLoading) {
    return (
      <div className={styles.book_view_page_wrapper}>
        <div className={styles.book_view_page}>
          <BookDetailsPageSkeleton />
        </div>
      </div>
    );
  }

  const {
    name,
    genre,
    authors,
    publisher,
    dateOfRelease,
    likes,
    dislikes,
    views,
    about,
    createdAt,
  } = book;

  return (
    <div className={styles.book_view_page_wrapper}>
      <div className={styles.book_view_page}>
        <div className={styles.book_details_section}>
          {showRatingPost && (
            <RatingPost
              bookId={id}
              setExecuteFetchRatings={setExecuteFetchRatings}
              setShowRatingPost={setShowRatingPost}
              userRating={userRating}
              setUserRating={setUserRating}
              userRatingId={userRatingId}
              setUserRatingId={setUserRatingId}
            />
          )}
          <div
            className={`${styles.book_cover} book_${genre
              .split(' ')
              .join('_')}`}
          >
            <h4 className={styles.book_name}>{name}</h4>
            <h5 className={styles.book_author}>{authors[0].name}</h5>
          </div>
          <div className={styles.book_info}>
            <div className={styles.name_and_icon_container}>
              <h4 className={styles.book_name}>{name}</h4>
              <span className={styles.saved_icon}>
                {!isBookSaved ? (
                  <span onClick={handleSave}>
                    <SavedIcon height="16" width="15" color="black" />
                  </span>
                ) : (
                  <span onClick={handleUnsave}>
                    <SavedActiveIcon height="16" width="15" color="black" />
                  </span>
                )}
              </span>
            </div>

            <div className={styles.book_authors_container}>
              {authors.map((currentAuthor) => (
                <Link
                  className={styles.author_container}
                  key={currentAuthor.id}
                  to={`/author/${currentAuthor.id}`}
                >
                  <p>{currentAuthor.name}</p>
                  <span>
                    {' '}
                    <GrLinkUp size={12} className={styles.link_icon} />
                  </span>
                </Link>
              ))}
            </div>
            <Link
              className={styles.publisher_container}
              to={`/publisher/${publisher.id}`}
            >
              <p> {publisher.name}</p>
              <span>
                {' '}
                <GrLinkUp
                  size={10}
                  style={{ transform: 'rotate(45deg)', margin: 'auto 0px' }}
                />
              </span>
            </Link>
            <p className={styles.genre}>{genre}</p>
            <p className={styles.date_of_release}>
              {convertToWordedDate(dateOfRelease)}
            </p>

            <div className={styles.user_reactions_container}>
              <span className={styles.view_container}>
                <AiFillEye size={20} />
                <p>{roundOffNumber(views)}</p>
              </span>
              <span className={styles.like_container}>
                {likeState.liked ? (
                  <AiFillLike onClick={removeLikeEvent} size={20} />
                ) : (
                  <AiOutlineLike onClick={clickLikeEvent} size={20} />
                )}
                <p>{roundOffNumber(likeState.numberOfLikes)}</p>
              </span>
              <span className={styles.dislike_container}>
                {likeState.disliked ? (
                  <AiFillDislike size={20} onClick={removeDislikeEvent} />
                ) : (
                  <AiOutlineDislike size={20} onClick={clickDislikeEvent} />
                )}
                <p>{roundOffNumber(likeState.numberOfDislikes)}</p>
              </span>
              <span
                onClick={() => setShowRatingPost(true)}
                style={{ flexShrink: 0 }}
                className={styles.rating_container}
              >
                {userRating === 0 ? (
                  <AiOutlineStar size={20} />
                ) : (
                  <AiFillStar size={20} />
                )}

                <p>{`${getAverageRating(ratings)}/ 10`}</p>
              </span>
            </div>
            <p className={styles.about_container}>{about}</p>
          </div>
        </div>

        <div className={styles.comments_section}>
          <div className={styles.number_of_ratings_and_comments_container}>
            {comments.length > 0 && (
              <p>
                {comments.length === 1
                  ? '1 comment '
                  : `${roundOffNumber(comments.length)} comments`}
              </p>
            )}
            {comments.length > 0 && ratings.length > 0 && <p>.</p>}
            {ratings.length > 0 && (
              <p>
                {ratings.length === 1
                  ? '1 rating'
                  : `${roundOffNumber(ratings.length)} ratings`}
              </p>
            )}
          </div>
          <form
            onSubmit={handleCommentSubmit}
            className={styles.comment_input_container}
          >
            <textarea
              draggable="false"
              placeholder="add a comment ..."
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={comment.length === 0}
            >
              <AiFillRightCircle
                color={comment.length === 0 ? '#b4b8bc' : '#08090a'}
                size={24}
              />
            </button>
          </form>
          <div className={styles.comments_container}>
            {comments.map((currentComment) => (
              <Comment
                {...currentComment}
                setExecuteFetchComments={setExecuteFetchComments}
                key={currentComment.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
