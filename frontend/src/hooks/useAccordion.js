import { useState, useCallback } from 'react';

/**
 * Custom hook for managing accordion state
 * @param {string|null} initialSection - Initially open section
 * @returns {[string|null, function]} - [openSection, toggleSection]
 */
function useAccordion(initialSection = null){
  const [openSection, setOpenSection] = useState(initialSection);

  const toggleSection = useCallback((sectionName) => {
    setOpenSection(prev => prev === sectionName ? null : sectionName);
  }, []);

  return [openSection, toggleSection];
}

export default useAccordion;
