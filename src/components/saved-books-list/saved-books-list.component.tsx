import { motion } from 'framer-motion';
import React, { FC } from 'react';
import {
  listItemVariants,
  listVariants,
} from '../../animation/list-animation-vertical';
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
      <motion.div variants={listVariants} initial="hidden" animate="visible">
        {books.length > 0 &&
          books.map((currentBook, index) => (
            <motion.div variants={listItemVariants}>
              <SavedBook key={currentBook.id} {...currentBook} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default SavedBooksList;
