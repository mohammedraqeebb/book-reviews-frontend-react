import { motion } from 'framer-motion';
import React, { FC } from 'react';
import {
  getListItemVariants,
  getListVariants,
} from '../../animation/list-animation';
import { Book } from '../../pages/search';
import SavedBook from '../saved-book/saved-book.component';
import styles from './SavedBookList.module.scss';
type SavedBookListProps = {
  books: Book[];
};

const SavedBooksList: FC<SavedBookListProps> = ({ books }) => {
  return (
    <div className={styles.saved_books_list_container}>
      {books.length === 0 && <h5>your saved books list is empty</h5>}
      <motion.div
        variants={getListVariants(0.2)}
        initial="hidden"
        animate="visible"
      >
        {books.length > 0 &&
          books.map((currentBook, index) => (
            <motion.div variants={getListItemVariants(50)}>
              <SavedBook key={currentBook.id} {...currentBook} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default SavedBooksList;
