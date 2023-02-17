const useDocumentTitle = (pathname: string) => {
  let pageTitle = '';

  if (pathname.slice(1) === 'search') {
    pageTitle = 'search';
    document.title = 'Book Reviews' + ' | ' + pageTitle;
  } else if (pathname.slice(1) === 'post') {
    pageTitle = 'post';
    document.title = 'Book Reviews' + ' | ' + pageTitle;
  } else if (pathname.slice(1) === 'profile') {
    pageTitle = 'profile';
    document.title = 'Book Reviews' + ' | ' + pageTitle;
  } else if (pathname.slice(1) === 'saved') {
    pageTitle = 'saved';
    document.title = 'Book Reviews' + ' | ' + pageTitle;
  } else document.title = 'Book Reviews';
};

export default useDocumentTitle;
