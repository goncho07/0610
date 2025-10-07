import { useEffect, useCallback } from 'react';

/**
 * A custom hook to trigger a callback on a specific hotkey combination (Ctrl/Cmd + K).
 * @param callback The function to execute when the hotkey is pressed.
 */
export const useHotkey = (callback: (e: KeyboardEvent) => void) => {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        callback(event);
      }
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);
};
