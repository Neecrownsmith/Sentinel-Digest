import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing scroll-to-top functionality
 * @param {number} threshold - Scroll threshold in pixels to show the button
 * @returns {[boolean, function]} - [showButton, scrollToTop]
 */
function useScrollToTop(threshold = 500){
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return [showButton, scrollToTop];
}

export default useScrollToTop;
