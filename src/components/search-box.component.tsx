import React, { FC, InputHTMLAttributes } from 'react';
import styles from './SearchBox.module.scss';
import { AiOutlineSearch } from 'react-icons/ai';

type SearchBoxProps = {
  width?: string;
  height?: string;
  iconSize?: number;
} & InputHTMLAttributes<HTMLInputElement>;

const SearchBox: FC<SearchBoxProps> = ({
  width,
  height,
  iconSize,
  ...props
}) => {
  return (
    <div style={{ width, height }} className={styles.search_box_container}>
      <input className={styles.search_box} {...props} />
    </div>
  );
};

export default SearchBox;
