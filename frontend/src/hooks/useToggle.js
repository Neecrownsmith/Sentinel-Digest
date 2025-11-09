import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean toggle state
 * @param {boolean} initialValue - Initial state value
 * @returns {[boolean, function, function, function]} - [value, toggle, setTrue, setFalse]
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};

export default useToggle;
