import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './BookSlider.module.scss';
import { Book } from '../../pages/search';
import { Link } from 'react-router-dom';

type BookSliderProps = {
  books: Book[];
};

const BookSlider = ({ books }: BookSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [books.length]);

  const activeBook = books[activeIndex];
  if (!activeBook) {
    return null;
  }
  const { id, name, authors, genre } = activeBook;

  return (
    <div className={`${styles.container}`}>
      <div className={styles.book_container}>
        <Link to={`book/${id}`}>
          <h1 className={styles.container_title}>currently trending</h1>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.book_details}>
              <h1 className={styles.book_title}>{name}</h1>
              <h3
                style={{
                  color: 'white',
                  marginBottom: '10px',
                }}
              >
                {genre}
              </h3>
              <div className={styles.authors}>
                {authors.map((author, index) => (
                  <span key={index} className={styles.author}>
                    by {author.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default BookSlider;
