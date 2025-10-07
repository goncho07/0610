import { useEffect, useRef, useCallback } from 'react';

export const useFocusTrap = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const handleFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) {
      return;
    }

    const focusableElements = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.focus();
      document.addEventListener('keydown', handleFocus);
    }
    return () => {
      document.removeEventListener('keydown', handleFocus);
    };
  }, [handleFocus]);

  return ref;
};
