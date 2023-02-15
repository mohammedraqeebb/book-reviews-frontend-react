import axios from 'axios';

import React, { FC, useEffect, useState } from 'react';
import BookDetailsSearch from '../../components/book-details-search/book-details-search. component';
import { Book } from '../search';

import styles from '../../styles/PublisherDetails.module.scss';
import { convertToWordedDate } from '../../util/convert-to-worded-date';
import { GrLocationPin } from 'react-icons/gr';
import buildClient from '../../util/build-client';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../main';
import PageSkeleton from '../../components/page-skeleton.component';

type PublisherDetailsProps = {
  id: string;
  name: string;
  userId: string;
  bio: string;
  street: string;
  state: string;
  establishedDate: string;
  countryCode: string;
  country: string;
  phoneNumber: string;
  books: Book[];
};

const PublisherDetails = () => {
  const { id } = useParams();
  const [publisher, setPublisher] = useState<PublisherDetailsProps | null>(
    null
  );
  const fetchPublisher = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/publisher/${id}`);
    setPublisher(data.publisher);
  };
  useEffect(() => {
    fetchPublisher();
  }, []);
  if (!publisher) {
    return <PageSkeleton />;
  }

  const {
    name,

    userId,
    bio,
    street,
    state,
    establishedDate,
    country,
    countryCode,
    phoneNumber,
    books,
  } = publisher;
  return (
    <div className={styles.publisher_page_wrapper}>
      <div className={styles.publisher_page_container}>
        <div className={styles.publisher_details_container}>
          <div className={styles.publisher_logo}>
            <h1>
              {name
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')
                .toLocaleUpperCase()}
            </h1>
          </div>
          <div className={styles.publisher_details}>
            <h3 className={styles.publisher_name}>{name}</h3>
            <h6 className={styles.publisher_date}>
              since {convertToWordedDate(establishedDate.substring(0, 14))}
            </h6>
            <p className={styles.publisher_bio}>{bio}</p>
            <div className={styles.publisher_address}>
              <p className={styles.publisher_address_header}>
                <GrLocationPin size={14} style={{ margin: '0 auto' }} />
                Address
              </p>
              <div>
                <p className={styles.publisher_street}>{street}</p>
                <div className={styles.publisher_state_and_coutry}>
                  <p className={styles.publisher_state}>{state} </p>
                  <p className={styles.publisher_country}>{country}</p>
                </div>
              </div>

              <p className={styles.publisher_phone_number}>
                {countryCode} {phoneNumber}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.books_container}>
          <h4>Published Books</h4>
          {books.length === 0 && (
            <h6>the company has not published any books yet</h6>
          )}
          {books.length >= 0 &&
            books.map((currentBook: Book) => (
              <BookDetailsSearch key={currentBook.id} {...currentBook} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherDetails;
