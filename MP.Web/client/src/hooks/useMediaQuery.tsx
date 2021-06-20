import { useState, useEffect } from 'react';

function useMediaQuery(mediaString: string) {
  const mql = window.matchMedia(mediaString);
  const [res, setRes] = useState(mql.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setRes(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  });
  
  return res;
}

export default useMediaQuery;