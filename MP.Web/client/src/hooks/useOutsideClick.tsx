import { useEffect, RefObject } from 'react';

export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void): void => {
  useEffect(() => {

    const handleClickOutside = (event: Event): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return (): void => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
  }