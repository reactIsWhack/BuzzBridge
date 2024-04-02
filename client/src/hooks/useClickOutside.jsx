import { useEffect } from 'react';

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.parentRef.current &&
        !ref.parentRef.current.contains(event.target) &&
        ref.childRef.current &&
        !ref.childRef.current.contains(event.target)
      ) {
        callback();

        // If the user was interacting with the expanded search bar and then closed it, animate the search icon to fade in
        if (ref.parentRef.current.id === 'search-bar') {
          document
            .getElementById('search-icon')
            .animate([{ height: 0 }, { height: '20px' }], {
              duration: 500,
            });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
