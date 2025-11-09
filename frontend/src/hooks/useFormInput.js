import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form input state
 * @param {string} initialValue - Initial input value
 * @returns {[string, function, function]} - [value, handleChange, reset]
 */
const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, handleChange, reset];
};

export default useFormInput;
