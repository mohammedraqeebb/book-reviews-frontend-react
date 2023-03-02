import React, { FC, useRef, TouchEvent, useState, MouseEvent } from 'react';
import { Book } from '../../pages/search';
import BookCover from '../book-cover/book-cover.component';
import styles from './BooksList.module.scss';
import useHorizontalMouseScroll from '../../hooks/use-horizontal-mouse-scroll';
import { motion } from 'framer-motion';
type BooksListProps = {
  books: Book[];
  listTitle: string;
};

const BooksList: FC<BooksListProps> = ({ books, listTitle }) => {
  const containerRef = useHorizontalMouseScroll();

  const listVariants = {
    visible: {
      transition: { straggerChildren: 0.1 },
    },
    hidden: {},
  };
  const listItemVariants = {
    visible: {
      opacity: 1,
      x: 0,
    },
    hidden: {
      opacity: 0,
      x: 50,
    },
  };

  return (
    <div className={styles.books_list_component}>
      <h3 className={styles.books_list_title}>{listTitle}</h3>
      <motion.div
        ref={containerRef}
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={styles.books_list_container}
      >
        {books &&
          books.map((book) => (
            <motion.div
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -8 }}
            >
              <BookCover key={book.id} {...book} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default BooksList;
