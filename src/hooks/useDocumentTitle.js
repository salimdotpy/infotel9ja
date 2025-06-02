import { useLayoutEffect } from 'react';

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'InfoTel9ja';
    }
  }, [title]);
};

export default useDocumentTitle;
