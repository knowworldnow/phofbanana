import { useEffect } from 'react';
import { submitToIndexNow } from '../utils/indexNow';

export function useIndexNow(url) {
  useEffect(() => {
    if (url) {
      submitToIndexNow(url);
    }
  }, [url]);
}
