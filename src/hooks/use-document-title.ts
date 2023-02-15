import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = 'Book Reviews ' + title;
  }, [title]);
};

export default useDocumentTitle;
